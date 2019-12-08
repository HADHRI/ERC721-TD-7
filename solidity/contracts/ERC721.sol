pragma solidity >=0.4.21 <0.6.0;
import "../utils/Counters.sol";
import "../utils/IERC721Receiver.sol";
import "../utils/Context.sol";
import "../utils/Adress.sol";
contract ERC721 is Context{
 using Counters for Counters.Counter;
using Address for address;

 // Equals to `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`
    // which can be also obtained as `IERC721Receiver(0).onERC721Received.selector`
    bytes4 private constant _ERC721_RECEIVED = 0x150b7a02;
 //Name Registry 
    string  public registryName;
//Number of total tokens that will increment every token creation
    uint256 public totalNumberOfTokens=0;
 // Mapping from token ID to owner 
    mapping (uint256 => address) private _tokenOwner;

// Mapping from owner to number of owned token
    mapping (address => Counters.Counter) public _ownedTokensCount; 

 // Mapping from token ID to approved address
    mapping (uint256 => address) private _tokenApprovals;
 
 //Animal ID
    uint public _currentId=0;
    mapping (address => Animal[]) private _animalsOfOwner;
    mapping (uint => Animal) public _animalsById; 
    mapping (uint => address) public  _animalToOwner;


 // Mapping from owner to operator approvals
    mapping (address => mapping (address => bool)) private _operatorApprovals;
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);
    event PaymentReceived(address from, uint256 amount);

    enum AnimalType { Cow, Horse, Chicken}
    enum Age { Young, Adult, Old }


    struct Animal {
        uint id;
        AnimalType race;
        Age age;
        }


       constructor(string memory _registryName) public {
        // allocate the name_registry
        registryName=_registryName;}

    /** 
    This function is responsible of Creation a new Animal ( token) 
    Every one can Call this fucntion but he has to pay 0.1 ETH = 100000000000000000 Wei
    Otherwise the transaction fails.
    **/
    function declareAnimal(address to, AnimalType race, Age age)
        public  payable returns (bool) {
        require(msg.value >= 100000000000000000);
        _currentId++;
        Animal memory animal = Animal(_currentId, race, age);
        _animalsOfOwner[msg.sender].push(animal);
        _animalsById[_currentId] = animal;
        _animalToOwner[_currentId] = to;
        mintToken(to, _currentId);
         emit PaymentReceived(_msgSender(), msg.value);
        return true;
    }

     function mintToken(address to, uint tokenId) internal {
        _mint(to, tokenId);
    }
 // In mint function , we increment the nmber of totalTokens and the ownerToeknsCount.            
    function _mint(address to, uint tokenId) internal {
        require(to != address(0), "address 0x0");
        require(!_exists(tokenId), "token already exists");
        _tokenOwner[tokenId] = to;
        _ownedTokensCount[to].increment();
        totalNumberOfTokens++;
        emit Transfer(address(0), to, tokenId);
    }


    function balanceOf(address owner) public view returns (uint256) {
        require(owner != address(0), "ERC721: balance query for the zero address");
        return _ownedTokensCount[owner].current();
    }

/**
     * @dev Gets the owner of the specified token ID.
     * @param tokenId uint256 ID of the token to query the owner of
     * @return address currently marked as the owner of the given token ID
     */
    function ownerOf(uint256 tokenId) public view returns (address) {
        address owner = _tokenOwner[tokenId];
        require(owner != address(0), "ERC721: owner query for nonexistent token");
        return owner;
    } 

    function transferFrom(address from, address to, uint256 tokenId) public {
        //solhint-disable-next-line max-line-length
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");

        _transferFrom(from, to, tokenId);
    }
    function safeTransferFrom(address from, address to, uint256 tokenId) public {
        safeTransferFrom(from, to, tokenId, "");
    }

     function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory _data) public {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");
        _safeTransferFrom(from, to, tokenId, _data);
    }

    function approve(address to, uint256 tokenId) public {
        address owner = ownerOf(tokenId);
        require(to != owner, "ERC721: approval to current owner");

        require(_msgSender() == owner || isApprovedForAll(owner, _msgSender()),
            "ERC721: approve caller is not owner nor approved for all"
        );

        _tokenApprovals[tokenId] = to;
        emit Approval(owner, to, tokenId);
    }
    function getApproved(uint256 tokenId) public view returns (address) {
        require(_exists(tokenId), "ERC721: approved query for nonexistent token");

        return _tokenApprovals[tokenId];
    }

    function isApprovedForAll(address owner, address operator) public view returns (bool) {
        return _operatorApprovals[owner][operator];
    }

    function setApprovalForAll(address to, bool approved) public {
        require(to != _msgSender(), "ERC721: approve to caller");

        _operatorApprovals[_msgSender()][to] = approved;
        emit ApprovalForAll(_msgSender(), to, approved);
    }

    function _safeTransferFrom(address from, address to, uint256 tokenId, bytes memory _data) internal {
        _transferFrom(from, to, tokenId);
        require(_checkOnERC721Received(from, to, tokenId, _data), "ERC721: transfer to non ERC721Receiver implementer");
    }

    function _checkOnERC721Received(address from, address to, uint256 tokenId, bytes memory _data)
        internal returns (bool)
    {
        if (!to.isContract()) {
            return true;
        }

        bytes4 retval = IERC721Receiver(to).onERC721Received(_msgSender(), from, tokenId, _data);
        return (retval == _ERC721_RECEIVED);
    }

    function _clearApproval(uint256 tokenId) private {
        if (_tokenApprovals[tokenId] != address(0)) {
            _tokenApprovals[tokenId] = address(0);
        }
    }


    function _isApprovedOrOwner(address spender, uint256 tokenId) internal view returns (bool) {
        require(_exists(tokenId), "ERC721: operator query for nonexistent token");
        address owner = ownerOf(tokenId);
        return (spender == owner || getApproved(tokenId) == spender || isApprovedForAll(owner, spender));
    }
  
    function _exists(uint256 tokenId) internal view returns (bool) {
        address owner = _tokenOwner[tokenId];
        return owner != address(0);
    }

    function _transferFrom(address from, address to, uint256 tokenId) internal {
        require(ownerOf(tokenId) == from, "ERC721: transfer of token that is not own");
        require(to != address(0), "ERC721: transfer to the zero address");

        _clearApproval(tokenId);

        _ownedTokensCount[from].decrement();
        _ownedTokensCount[to].increment();

        _tokenOwner[tokenId] = to;

        emit Transfer(from, to, tokenId);
    }

}