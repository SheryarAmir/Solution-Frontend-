import React, { useRef, useState } from 'react';

interface SearchInputProps {
  onSearch: (value: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ onSearch }) => {
  const [isInputShown, setIsInputShown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const showInput = () => {
    setIsInputShown(true);
    inputRef.current?.focus();
  };

  const hideInput = () => {
    setIsInputShown(false);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <div className="flex items-center">
      <i 
        className="control-icon ion ion-ios-search text-3xl hover:cursor-pointer"
        onClick={showInput}
      ></i>
      <input
        placeholder="Type your search request here..."
        ref={inputRef}
        className={`border-none outline-none ml-4 w-60 transition-all duration-200 ease-in-out ${
          !isInputShown ? 'w-0 m-0' : ''
        }`}
        onBlur={hideInput}
        onChange={handleInput}
      />
    </div>
  );
};

export default SearchInput;