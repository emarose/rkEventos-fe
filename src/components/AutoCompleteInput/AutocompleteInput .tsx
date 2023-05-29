import React, { useEffect, useState } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";

interface Option {
  product_id: string;
  description: string;
  price: string;
}

interface AutocompleteInputProps {
  fetchOptions: () => Promise<Option[]>;
  selectedOption: Option[];
  onOptionChange: (selected: Option[]) => void;
}

export const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  fetchOptions,
  selectedOption,
  onOptionChange,
}) => {
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedOptions = await fetchOptions();
        setOptions(fetchedOptions);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchData();
  }, [fetchOptions]);

  const handleInputChange = (selected: any) => {
    onOptionChange(selected);
  };

  return (
    <Typeahead
      id="autocomplete-input"
      labelKey="description"
      multiple={false}
      options={options}
      placeholder="Ingrese un producto"
      onChange={handleInputChange}
      selected={selectedOption}
      clearButton
      inputProps={{
        className: "form-control bg-dark bg-opacity-75 text-info border-info",
      }}
    />
  );
};
