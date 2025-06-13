
// import "./range-slider.module.css"
import { useState, useRef, useCallback, useEffect } from "react";

export default function RangeSlider({
    min = 0, max = 100, step = 1, defaultMin = 20, defaultMax = 80, onChange,
    label = "Range Slider", showValues = true, disabled = false, className = "", inputClassName = "", prefix = "", suffix = "" }: any) {

    const [minValue, setMinValue] = useState(defaultMin);
    const [maxValue, setMaxValue] = useState(defaultMax);

    const [minInputValue, setMinInputValue] = useState(defaultMin.toString());
    const [maxInputValue, setMaxInputValue] = useState(defaultMax.toString());

    const [activeThumb, setActiveThumb] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const sliderRef: any = useRef(null);

    // Sync input values when slider values change
  useEffect(() => {
    setMinInputValue(minValue.toString());
    setMaxInputValue(maxValue.toString());
  }, [minValue, maxValue]);

    const updateValue = useCallback((clientX: any, thumbType: any) => {
        if (!sliderRef.current) return;

        const rect = sliderRef.current.getBoundingClientRect();
        const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        const newValue = Math.round((min + percentage * (max - min)) / step) * step;

        if (thumbType === 'min') {
            const clampedValue = Math.min(newValue, maxValue - step);
            setMinValue(Math.max(min, clampedValue));
            onChange?.([Math.max(min, clampedValue), maxValue]);
        } else if (thumbType === 'max') {
            const clampedValue = Math.max(newValue, minValue + step);
            setMaxValue(Math.min(max, clampedValue));
            onChange?.([minValue, Math.min(max, clampedValue)]);
        }
    }, [min, max, step, minValue, maxValue, onChange]);

    const handleTrackClick = (e: any) => {
        if (disabled || isDragging) return;

        const rect = sliderRef.current.getBoundingClientRect();
        const percentage = (e.clientX - rect.left) / rect.width;
        const clickValue = min + percentage * (max - min);

        // Determine which thumb is closer to the click
        const distanceToMin = Math.abs(clickValue - minValue);
        const distanceToMax = Math.abs(clickValue - maxValue);

        if (distanceToMin < distanceToMax) {
            updateValue(e.clientX, 'min');
        } else {
            updateValue(e.clientX, 'max');
        }
    };

    const handleThumbMouseDown = (e: any, thumbType: any) => {
        if (disabled) return;
        e.stopPropagation();
        setActiveThumb(thumbType);
        setIsDragging(true);
    };

    const handleMouseMove = useCallback((e: any) => {
        if (isDragging && activeThumb && !disabled) {
            updateValue(e.clientX, activeThumb);
        }
    }, [isDragging, activeThumb, disabled, updateValue]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        setActiveThumb(null);
    }, []);

    // Global mouse event listeners for dragging
    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.userSelect = 'none'; // Prevent text selection while dragging
        } else {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.userSelect = '';
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.userSelect = '';
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    const handleKeyDown = (e: any, thumbType: any) => {
        if (disabled) return;

        let newMinValue = minValue;
        let newMaxValue = maxValue;

        switch (e.key) {
            case 'ArrowLeft':
            case 'ArrowDown':
                if (thumbType === 'min') {
                    newMinValue = Math.max(min, minValue - step);
                } else {
                    newMaxValue = Math.max(minValue + step, maxValue - step);
                }
                break;
            case 'ArrowRight':
            case 'ArrowUp':
                if (thumbType === 'min') {
                    newMinValue = Math.min(maxValue - step, minValue + step);
                } else {
                    newMaxValue = Math.min(max, maxValue + step);
                }
                break;
            case 'Home':
                if (thumbType === 'min') {
                    newMinValue = min;
                } else {
                    newMaxValue = minValue + step;
                }
                break;
            case 'End':
                if (thumbType === 'min') {
                    newMinValue = maxValue - step;
                } else {
                    newMaxValue = max;
                }
                break;
            default:
                return;
        }

        e.preventDefault();
        // setMinValue(newMinValue);
        // setMaxValue(newMaxValue);
        // onChange?.([newMinValue, newMaxValue]);
        validateAndSetValues(newMinValue, newMaxValue);
    };

    const validateAndSetValues = useCallback((newMin: any, newMax: any) => {
        // Ensure values are within bounds and maintain proper order
        const validMin = Math.max(min, Math.min(newMin, newMax - step));
        const validMax = Math.min(max, Math.max(newMax, newMin + step));

        setMinValue(validMin);
        setMaxValue(validMax);
        onChange?.([validMin, validMax]);
    }, [min, max, step, onChange]);

    const handleMinInputChange = (e: any) => {
        const value = e.target.value;
        setMinInputValue(value);
    };

    const handleMaxInputChange = (e: any) => {
        const value = e.target.value;
        setMaxInputValue(value);
    };

    const handleMinInputBlur = () => {
        const numValue = parseFloat(minInputValue);
        if (!isNaN(numValue)) {
            validateAndSetValues(numValue, maxValue);
        } else {
            setMinInputValue(minValue.toString());
        }
    };

    const handleMaxInputBlur = () => {
        const numValue = parseFloat(maxInputValue);
        if (!isNaN(numValue)) {
            validateAndSetValues(minValue, numValue);
        } else {
            setMaxInputValue(maxValue.toString());
        }
    };

    const handleInputKeyDown = (e: any, type: any) => {
        if (e.key === 'Enter') {
            e.target.blur();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const currentValue = type === 'min' ? minValue : maxValue;
            const newValue = Math.min(max, currentValue + step);
            if (type === 'min') {
                validateAndSetValues(newValue, maxValue);
            } else {
                validateAndSetValues(minValue, newValue);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            const currentValue = type === 'min' ? minValue : maxValue;
            const newValue = Math.max(min, currentValue - step);
            if (type === 'min') {
                validateAndSetValues(newValue, maxValue);
            } else {
                validateAndSetValues(minValue, newValue);
            }
        }
    };

    const minPercentage = ((minValue - min) / (max - min)) * 100;
    const maxPercentage = ((maxValue - min) / (max - min)) * 100;

    return (
        <div className={`w-full max-w-md mx-auto ${className}`}>


            <div className="flex items-center gap-3 mb-4">
                <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Min Value</label>
                    <div className="relative">
                        {prefix && (
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                                {prefix}
                            </span>
                        )}
                        <input
                            type="number"
                            value={minInputValue}
                            onChange={handleMinInputChange}
                            onBlur={handleMinInputBlur}
                            onKeyDown={(e) => handleInputKeyDown(e, 'min')}
                            min={min}
                            max={maxValue - step}
                            step={step}
                            disabled={disabled}
                            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${prefix ? 'pl-8' : ''
                                } ${suffix ? 'pr-8' : ''} ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''
                                } ${inputClassName}`}
                        />
                        {suffix && (
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                                {suffix}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex-shrink-0 text-gray-400 font-medium">to</div>

                <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Max Value</label>
                    <div className="relative">
                        {prefix && (
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                                {prefix}
                            </span>
                        )}
                        <input
                            type="number"
                            value={maxInputValue}
                            onChange={handleMaxInputChange}
                            onBlur={handleMaxInputBlur}
                            onKeyDown={(e) => handleInputKeyDown(e, 'max')}
                            min={minValue + step}
                            max={max}
                            step={step}
                            disabled={disabled}
                            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${prefix ? 'pl-8' : ''
                                } ${suffix ? 'pr-8' : ''} ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''
                                } ${inputClassName}`}
                        />
                        {suffix && (
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                                {suffix}
                            </span>
                        )}
                    </div>
                </div>
            </div>




            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                    {showValues && (
                        <span className="ml-2 text-blue-600 font-semibold">
                            {minValue} - {maxValue}
                        </span>
                    )}
                </label>
            )}

            <div className="relative">
                {/* Track */}
                <div
                    ref={sliderRef}
                    className={`relative h-2 bg-gray-200 rounded-full transition-all duration-200 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-300'
                        }`}
                    onClick={handleTrackClick}
                >
                    {/* Selected range */}
                    <div
                        className="absolute top-0 h-full bg-blue-500 rounded-full transition-all duration-200"
                        style={{
                            left: `${minPercentage}%`,
                            width: `${maxPercentage - minPercentage}%`
                        }}
                    />

                    {/* Min thumb */}
                    <div
                        className={`absolute top-1/2 w-5 h-5 bg-white border-2 border-blue-500 rounded-full transform -translate-y-1/2 z-10 transition-all duration-200 ${disabled
                                ? 'cursor-not-allowed opacity-50'
                                : 'cursor-grab hover:scale-110 focus:scale-110 hover:shadow-lg focus:shadow-lg'
                            } ${activeThumb === 'min' ? 'scale-110 shadow-lg cursor-grabbing border-blue-600' : ''}`}
                        style={{ left: `calc(${minPercentage}% - 10px)` }}
                        tabIndex={disabled ? -1 : 0}
                        role="slider"
                        aria-valuemin={min}
                        aria-valuemax={maxValue - step}
                        aria-valuenow={minValue}
                        aria-label={`${label} minimum value`}
                        onMouseDown={(e) => handleThumbMouseDown(e, 'min')}
                        onKeyDown={(e) => handleKeyDown(e, 'min')}
                        onFocus={(e) => e.target.style.outline = '2px solid #3b82f6'}
                        onBlur={(e) => e.target.style.outline = 'none'}
                    />

                    {/* Max thumb */}
                    <div
                        className={`absolute top-1/2 w-5 h-5 bg-white border-2 border-blue-500 rounded-full transform -translate-y-1/2 z-10 transition-all duration-200 ${disabled
                                ? 'cursor-not-allowed opacity-50'
                                : 'cursor-grab hover:scale-110 focus:scale-110 hover:shadow-lg focus:shadow-lg'
                            } ${activeThumb === 'max' ? 'scale-110 shadow-lg cursor-grabbing border-blue-600' : ''}`}
                        style={{ left: `calc(${maxPercentage}% - 10px)` }}
                        tabIndex={disabled ? -1 : 0}
                        role="slider"
                        aria-valuemin={minValue + step}
                        aria-valuemax={max}
                        aria-valuenow={maxValue}
                        aria-label={`${label} maximum value`}
                        onMouseDown={(e) => handleThumbMouseDown(e, 'max')}
                        onKeyDown={(e) => handleKeyDown(e, 'max')}
                        onFocus={(e) => e.target.style.outline = '2px solid #3b82f6'}
                        onBlur={(e) => e.target.style.outline = 'none'}
                    />
                </div>

                {/* Min/Max labels */}
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{min}</span>
                    <span>{max}</span>
                </div>
            </div>
        </div>
    );
}