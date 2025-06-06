import React, { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/utils";

const RangeInput = ({
  min = 0,
  max = 100,
  unit,
  value,
  onChange,
  id,
  "aria-label": ariaLabel,
  "aria-invalid": invalid,
  className,
  disabled,
}: {
  min?: number;
  max?: number;
  unit?: string;
  value: number;
  onChange: (value: number) => void;
  id?: string;
  "aria-label"?: string;
  "aria-invalid"?: boolean;
  className?: string;
  disabled?: boolean;
}) => {
  const uid = React.useId();
  const componentId = id ?? uid;

  const [sliderValue, setSliderValue] = useState<number[]>([value]);
  const [inputValue, setInputValue] = useState<string>(value.toString());

  useEffect(() => {
    const clampedValue = Math.min(max, Math.max(min, value));
    setSliderValue([clampedValue]);
    setInputValue(clampedValue.toString());
  }, [value, min, max]);

  const validateAndUpdateValue = useCallback(
    (rawValue: string) => {
      if (rawValue === "" || rawValue === "-") {
        const defaultValue = Math.max(min, 0);
        setInputValue(defaultValue.toString());
        setSliderValue([defaultValue]);
        onChange(defaultValue);
        return;
      }

      const numValue = parseFloat(rawValue);

      if (isNaN(numValue)) {
        const currentSliderVal = sliderValue[0];
        if (currentSliderVal !== undefined) {
          setInputValue(currentSliderVal.toString());
        }
        return;
      }

      const clampedValue = Math.min(max, Math.max(min, numValue));

      setSliderValue([clampedValue]);
      setInputValue(clampedValue.toString());
      if (typeof clampedValue === "number") {
        onChange(clampedValue);
      }
    },
    [sliderValue, min, max, onChange],
  );

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    setInputValue(rawValue);

    if (rawValue === "" || rawValue === "-" || /^-?\d*\.?\d*$/u.test(rawValue)) {
      validateAndUpdateValue(rawValue);
    }
  }, []);

  const handleSliderChange = useCallback(
    (newValue: number[]) => {
      const firstValue = newValue[0];
      setSliderValue(newValue);
      if (firstValue !== undefined) {
        setInputValue(firstValue.toString());
        onChange(firstValue);
      }
    },
    [onChange],
  );

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <Slider
        value={sliderValue}
        onValueChange={handleSliderChange}
        min={min}
        max={max}
        step={1}
        aria-hidden
        className="grow"
        disabled={disabled ?? false}
      />
      <div className="relative flex h-8 items-center">
        <Input
          id={componentId}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={() => validateAndUpdateValue(inputValue)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              validateAndUpdateValue(inputValue);
            }
          }}
          aria-invalid={invalid}
          aria-label={ariaLabel}
          inputMode="numeric"
          className={cn("h-full w-16 rounded-md px-2 py-1 text-right", unit ? "pr-6" : "")}
          disabled={disabled}
        />
        {unit ? (
          <span className="pointer-events-none absolute right-1.5 ml-1 text-xs text-gray-500">{unit}</span>
        ) : null}
      </div>
    </div>
  );
};

export default RangeInput;
