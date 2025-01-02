import { useState } from 'react';
import { ChromePicker } from 'react-color';

const ColorPicker = () => {
    const [color, setColor] = useState('#000000')

    const handleChangeComplete = (color: any) => {
        setColor(color.hex);
    };
    return (
        <ChromePicker
            color={color}
            onChangeComplete={handleChangeComplete}
        />
    )
}

export default ColorPicker