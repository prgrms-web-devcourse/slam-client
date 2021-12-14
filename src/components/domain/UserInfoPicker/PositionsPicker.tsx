import { ChangeEvent } from "react";
import Radio from "@components/domain/RadioInput";
import type { PositionKeyUnion, PositionValueUnion } from "./types";

const positionItems: { value: PositionKeyUnion; text: PositionValueUnion }[] = [
  {
    value: "PF",
    text: "파워포워드",
  },
  {
    value: "SF",
    text: "스몰포워드",
  },
  {
    value: "SG",
    text: "슈팅가드",
  },
  {
    value: "PG",
    text: "포인트가드",
  },
  {
    value: "C",
    text: "센터",
  },
  {
    value: "TBD",
    text: "미정",
  },
];

interface Props {
  selectedValue: PositionKeyUnion[];
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const PositionsPicker: React.FC<Props> = ({ selectedValue, onChange }) => {
  return (
    <Radio.Group onChange={onChange}>
      {positionItems.map(({ text, value }) => (
        <Radio.Item
          key={value}
          text={text}
          value={value}
          checked={selectedValue.includes(value)}
        />
      ))}
    </Radio.Group>
  );
};

export default PositionsPicker;
