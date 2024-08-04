import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FC } from "react";
import DragHandleIcon from "@mui/icons-material/DragHandle";

const PriorityDragable = ({
  array,
  setArray,
  changeHandler,
  details,
  setDetails,
}: {
  array: any[];
  setArray: any;
  setDetails: any;
  details: any;
  changeHandler: any;
}) => {
  const [arrList, setArrList] = useState<any[]>(array);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = arrList.findIndex((item) => item === active.id);
      const newIndex = arrList.findIndex((item) => item === over.id);
      const newArr = arrayMove(arrList, oldIndex, newIndex);
      setArrList([...newArr]);
      setArray(newArr);
    }
  }
  console.log({ arrList });

  return (
    <div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext items={arrList} strategy={verticalListSortingStrategy}>
          {arrList.map((item, id) => (
            <UserItem
              key={id}
              prop={{ item, id, changeHandler, details, setDetails }}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default PriorityDragable;

interface UserItemProps {
  prop: {
    item: any;
    id: number;
    changeHandler: any;
    details: any;
    setDetails: any;
  };
}
const UserItem: FC<UserItemProps> = (props) => {
  const { item, changeHandler, details, setDetails } = props.prop;
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (item === "withdraw") {
    return (
      <div ref={setNodeRef} style={style} className="order">
        <div className="title">
          <span>Auto withdraw</span>
          <input
            onChange={() =>
              setDetails({
                ...details,
                autoWithdraw: !details.autoWithdraw,
              })
            }
            checked={details.autoWithdraw}
            type="checkbox"
            name="autoWithdraw"
            id="autoWithdraw"
          />
          <label htmlFor="autoWithdraw">On</label>

          <input
            type="range"
            name="withdraw_perc"
            id=""
            min="1"
            max="100"
            onChange={changeHandler}
            value={details.withdraw_perc}
            style={{
              accentColor: details.autoWithdraw ? "#0b5aee" : "gray",
            }}
          />
          <span>{details.withdraw_perc}%</span>
        </div>
        <button {...attributes} {...listeners} className="cursor-move">
          <DragHandleIcon />
        </button>
      </div>
    );
  } else if (item === "nextInvest") {
    return (
      <div ref={setNodeRef} style={style} className="order">
        <div className="title">
          <span>Auto Reserve for next invest</span>
          <input
            onChange={() =>
              setDetails({
                ...details,
                NextInvest: !details.NextInvest,
              })
            }
            checked={details.NextInvest}
            type="checkbox"
            name="NextInvest"
            id="NextInvest"
          />
          <label htmlFor="NextInvest"> On</label>
        </div>

        <button {...attributes} {...listeners} className="cursor-move">
          <DragHandleIcon />
        </button>
      </div>
    );
  } else
    return (
      <div ref={setNodeRef} style={style} className="order">
        <div className="title">
          <span>Auto recharge All Numbers</span>
          <input
            onChange={() =>
              setDetails({
                ...details,
                autoRecharge: !details.autoRecharge,
              })
            }
            checked={details.autoRecharge}
            type="checkbox"
            name="autoRecharge"
            id="autoRecharge"
          />
          <label htmlFor="autoRecharge">On</label>
        </div>

        <button {...attributes} {...listeners} className="cursor-move">
          <DragHandleIcon />
        </button>
      </div>
    );
};
