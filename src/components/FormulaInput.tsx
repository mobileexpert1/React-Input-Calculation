import { evaluate } from 'mathjs';
import React, { useState } from 'react';
import useStore, { Tag } from '../store';

const FormulaInput = () => {
  const operands = ['+', '-', '*', '/', '(', ')', '^'];
  const { tags, setTags, input, setInput, suggestions } = useStore();
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [express, setExpress] = useState('');
  const [total, setTotal] = useState(0);

  // Handles input change
  const handleInputChange = (e: any) => {
    const newValue = e.target.value;
    const lastChar = newValue.slice(-1);

    // If the last character is an operand, add it as a tag
    if (operands.includes(lastChar)) {
      setTags([...tags, { key: lastChar, value: lastChar }]);
      setInput('');
    } else {
      setInput(newValue);
      setHighlightedIndex(-1); // Reset the highlighted index when input changes
    }
  };

  // Deletes a tag by index
  const handleTagDelete = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  // Adds a new tag
  const handleAddTag = (tag: Tag) => {
    setTags([...tags, tag]);
    setInput('');
    setHighlightedIndex(-1); // Reset the highlighted index after adding a tag
  };

  // Filters suggestions based on input
  const getSuggestions = () => {
    if (!input) return suggestions;

    const lowerCaseInput = input.toLowerCase();
    const matched = suggestions.filter((s) =>
      s.key.toLowerCase().includes(lowerCaseInput)
    );

    const notMatched = suggestions.filter(
      (s) => !s.key.toLowerCase().includes(lowerCaseInput)
    );

    return [...matched, ...notMatched];
  };

  // Filtered Suggesitons
  const sortedSuggestions = getSuggestions();

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      // Add the highlighted suggestion or the first suggestion if Enter is pressed
      if (
        highlightedIndex >= 0 &&
        highlightedIndex < sortedSuggestions.length
      ) {
        handleAddTag(sortedSuggestions[highlightedIndex]);
      } else if (sortedSuggestions.length > 0) {
        handleAddTag(sortedSuggestions[0]);
      }
    } else if (e.key === 'Backspace' && input === '') {
      handleTagDelete(tags.length - 1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prevIndex) =>
        prevIndex < sortedSuggestions.length - 1 ? prevIndex + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : sortedSuggestions.length - 1
      );
    }
  };

  // Calculate the arithmetic expression
  const onCalculate = () => {
    const expression = tags.map((item) => item.value).join(' ');
    setExpress(expression);
    try {
      const result = evaluate(expression);
      setTotal(result);
    } catch (error: any) {
      alert('Invalid expression:');
      console.error('Invalid expression:', error.message);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        margin: '30px 20px 30px 20px',
        padding: 20,
        gap: 20,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          padding: '5px',
          border: '1px solid #d9d9d9',
          borderRadius: '4px',
          minHeight: '40px',
          gap: '5px',
        }}
      >
        {tags.map((tag, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '5px',
              backgroundColor: !operands.includes(tag.key)
                ? '#e0e0e0'
                : 'white',
              borderRadius: '4px',
              margin: '2px',
            }}
          >
            <span>{tag.key}</span>
            {!operands.includes(tag.key) && (
              <button
                onClick={() => handleTagDelete(index)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  marginLeft: '5px',
                  padding: '0',
                }}
              >
                x
              </button>
            )}
          </div>
        ))}
        <input
          style={{
            border: 'none',
            outline: 'none',
            flex: 1,
            padding: '5px',
            fontSize: '16px',
            minWidth: '150px',
          }}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
        />
      </div>

      {sortedSuggestions && (
        <div
          style={{
            marginTop: 10,
            position: 'relative',
            border: '1px solid black',
            padding: 10,
          }}
        >
          {sortedSuggestions.map((suggestion, index) => {
            return (
              suggestion.key.toLowerCase().includes(input.toLowerCase()) && (
                <div
                  key={index}
                  onClick={() => handleAddTag(suggestion)}
                  style={{
                    cursor: 'pointer',
                    padding: 5,
                    backgroundColor:
                      highlightedIndex === index ? '#b0c4de' : 'transparent',
                  }}
                >
                  {suggestion.key}
                </div>
              )
            );
          })}
        </div>
      )}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
        }}
      >
        <h3>Airthmetic Expression:</h3>
        <p>{express}</p>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
        }}
      >
        <h3>Total</h3>
        <p>{total}</p>
      </div>

      <button style={{ padding: 20, fontSize: 25 }} onClick={onCalculate}>
        Calculate
      </button>
    </div>
  );
};

export default FormulaInput;
