import { useEffect, useRef, useState } from "react";

export interface SelectOptions {
  label: string;
  value: number | string;
}

interface MultipleSelectProps {
  multiple: true;
  value: SelectOptions[];
  onChange: (value: SelectOptions[]) => void;
}

interface SingleSelectProps {
  multiple?: false;
  value?: SelectOptions;
  onChange: (value: SelectOptions | undefined) => void;
}

type SelectProps = {
  options: SelectOptions[];
} & (SingleSelectProps | MultipleSelectProps);

export const Select = ({ multiple, value, onChange, options }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) setHighlightedIndex(0);
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target !== containerRef.current) return;
      switch (e.code) {
        case "Enter":
        case "Space":
          setIsOpen((prev) => !prev);
          if (isOpen) selectOption(options[highlightedIndex]);
          break;
        case "ArrowUp":
        case "ArrowDown": {
          if (!open) {
            setIsOpen(true);
            break;
          }

          const newValue = highlightedIndex + (e.code === "ArrowDown" ? 1 : -1);
          if (newValue >= 0 && newValue < options.length) {
            setHighlightedIndex(newValue);
          }
          break;
        }
        case "Escape":
          setIsOpen(false);
          break;
      }
    };
    containerRef.current?.addEventListener("keydown", handler);

    return () => {
      containerRef.current?.removeEventListener("keydown", handler);
    };
  }, [isOpen, highlightedIndex]);

  function clearOptions() {
    multiple ? onChange([]) : onChange(undefined);
  }

  function selectOption(option: SelectOptions) {
    if (multiple) {
      if (value.includes(option)) {
        onChange(value.filter((item) => item !== option));
      } else {
        onChange([...value, option]);
      }
    } else {
      if (option !== value) onChange(option);
    }
  }

  function isOptionSelected(option: SelectOptions) {
    return multiple ? value.includes(option) : option === value;
  }

  return (
    <div
      ref={containerRef}
      onBlur={() => setIsOpen(false)}
      tabIndex={0}
      className="mt-5 mx-auto relative min-h-[1.5em] border-2 border-gray-400 flex items-center justify-center gap-[.5em] p-[.5em] rounded-md outline-none w-[20em] focus:border-cyan-300"
      onClick={() => setIsOpen((prevOpen) => !prevOpen)}
    >
      <span className="flex-grow-[1] flex gap-2 flex-wrap">
        {multiple
          ? value.map((item) => (
              <button
                className="group bg-none border-[.17em] border-gray-300 outline-none px-2 rounded-md flex gap-1 cursor-pointer items-center hover:bg-red-100 hover:border-red-600 focus:bg-red-100 focus:border-red-600"
                key={item.value}
                onClick={(e) => {
                  e.stopPropagation();
                  selectOption(item);
                }}
              >
                {item.label}
                <span className="group-hover:text-red-700 text-gray-300 text-xl">
                  &times;
                </span>
              </button>
            ))
          : value?.label}
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          clearOptions();
        }}
        className="bg-none text-gray-400 border-none outline-none cursor-pointer p-0 text-xl focus:text-gray-700 hover:text-gray-700"
      >
        &times;
      </button>
      <div className="bg-gray-400 self-stretch w-[0.05em]"></div>
      <div
        className="border-[.38em] border-transparent border-t-gray-400
        translate-y-[25%]"
      ></div>
      <ul
        className={`absolute overflow-y-scroll m-0 p-0 list-none max-h-60 border-2 border-gray-400 rounded-md w-full left-0 top-[calc(100%+.25em)] bg-white z-10 ${
          isOpen ? "block" : "hidden"
        }`}
      >
        {options.map((option, index) => (
          <li
            onClick={(e) => {
              e.stopPropagation();
              selectOption(option);
              setIsOpen(false);
            }}
            onMouseEnter={() => setHighlightedIndex(index)}
            key={option.value}
            className={`p-4 cursor-pointer ${
              isOptionSelected(option) ? "selected" : ""
            } ${index === highlightedIndex ? "highlighted" : ""}`}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
};
