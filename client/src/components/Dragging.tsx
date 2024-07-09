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

type User = {
  id: number;
  name: string;
  email: string;
};
const dummyData: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
  },
  {
    id: 3,
    name: "Alice Johnson",
    email: "alice@example.com",
  },
];

const DragableList = () => {
  const [userList, setUserList] = useState<User[]>(dummyData);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setUserList((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }
  console.log(userList);

  return (
    <div className="max-w-2xl mx-auto grid gap-2 my-10">
      <h2 className="text-2xl font-bold mb-4">User List</h2>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext
          items={userList}
          strategy={verticalListSortingStrategy}
        >
          {userList.map((user) => (
            <UserItem key={user.id} user={user} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default DragableList;

interface UserItemProps {
  user: {
    id: number;
    name: string;
    email: string;
  };
}
const UserItem: FC<UserItemProps> = (props) => {
  const { id, name, email } = props.user;
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      // {...attributes}
      // {...listeners}
      className="bg-blue-200 p-4 rounded shadow-md flex justify-between"
    >
      <div>
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-gray-600">{email}</p>
      </div>
      <button {...attributes} {...listeners} className="cursor-move">
        Drag
      </button>
    </div>
  );
};

// import React, { useEffect, useState } from "react";
// import {
//   DragDropContext,
//   Droppable,
//   Draggable,
//   DropResult,
//   DraggableProvided,
//   DraggableStateSnapshot,
//   DroppableProvided,
//   DroppableStateSnapshot,
// } from "react-beautiful-dnd";

// interface Item {
//   id: string;
//   content: string;
// }

// const data: Item[] = [
//   { id: "item-1", content: "Item-1" },
//   { id: "item-2", content: "Item-2" },
//   { id: "item-3", content: "Item-3" },
//   { id: "item-4", content: "Item-4" },
//   { id: "item-5", content: "Item-5" },
//   { id: "item-6", content: "Item-6" },
//   { id: "item-7", content: "Item-7" },
//   { id: "item-8", content: "Item-8" },
//   { id: "item-9", content: "Item-9" },
// ];

// // A function to help with reordering the result
// const reorder = (
//   list: Item[],
//   startIndex: number,
//   endIndex: number
// ): Item[] => {
//   const result = Array.from(list);
//   const [removed] = result.splice(startIndex, 1);
//   result.splice(endIndex, 0, removed);
//   return result;
// };

// const grid = 8;

// const getItemStyle = (
//   isDragging: boolean,
//   draggableStyle: React.CSSProperties | undefined
// ): React.CSSProperties => ({
//   userSelect: "none",
//   padding: grid * 2,
//   margin: `0 0 ${grid}px 0`,
//   background: isDragging ? "lightgreen" : "grey",
//   ...draggableStyle,
// });

// const getListStyle = (isDraggingOver: boolean): React.CSSProperties => ({
//   background: isDraggingOver ? "lightblue" : "lightgrey",
//   padding: grid,
//   width: 250,
//   margin: "1rem",
// });

// const App: React.FC = () => {
//   const [items, setItems] = useState<Item[]>([]);

//   useEffect(() => {
//     setItems(data);
//   }, []);

//   const onDragEnd = (result: DropResult) => {
//     if (!result.destination) {
//       return;
//     }

//     const reorderedItems = reorder(
//       items,
//       result.source.index,
//       result.destination.index
//     );

//     console.log({ reorderedItems });
//     setItems(reorderedItems);
//   };

//   return (
//     <div className="main_content">
//       <DragDropContext onDragEnd={onDragEnd}>
//         <Droppable droppableId="droppable">
//           {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
//             <div
//               {...provided.droppableProps}
//               ref={provided.innerRef}
//               style={getListStyle(snapshot.isDraggingOver)}
//             >
//               {items.map((item, index) => (
//                 <Draggable key={item.id} draggableId={item.id} index={index}>
//                   {(
//                     provided: DraggableProvided,
//                     snapshot: DraggableStateSnapshot
//                   ) => (
//                     <div
//                       className="card"
//                       ref={provided.innerRef}
//                       {...provided.draggableProps}
//                       {...provided.dragHandleProps}
//                       style={getItemStyle(
//                         snapshot.isDragging,
//                         provided.draggableProps.style
//                       )}
//                     >
//                       {item.content}
//                     </div>
//                   )}
//                 </Draggable>
//               ))}
//               {provided.placeholder}
//             </div>
//           )}
//         </Droppable>
//       </DragDropContext>
//     </div>
//   );
// };

// export default App;

// import React, { useState } from "react";
// import {
//   DndContext,
//   closestCenter,
//   KeyboardSensor,
//   PointerSensor,
//   useSensor,
//   useSensors,
//   DragEndEvent,
// } from "@dnd-kit/core";
// import {
//   arrayMove,
//   SortableContext,
//   sortableKeyboardCoordinates,
//   verticalListSortingStrategy,
// } from "@dnd-kit/sortable";
// import { useSortable } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";

// interface SortableItemProps {
//   id: number;
// }

// function App() {
//   const [items, setItems] = useState<number[]>([1, 2, 3]);
//   const sensors = useSensors(
//     useSensor(PointerSensor),
//     useSensor(KeyboardSensor, {
//       coordinateGetter: sortableKeyboardCoordinates,
//     })
//   );

//   const handleDragEnd = (event: DragEndEvent) => {
//     const { active, over } = event;

//     if (active && over && active.id !== over.id) {
//       setItems((items) => {
//         const oldIndex = items.indexOf(Number(active.id));
//         const newIndex = items.indexOf(Number(over.id));

//         return arrayMove(items, oldIndex, newIndex);
//       });
//     }
//   };

//   return (
//     <DndContext
//       sensors={sensors}
//       collisionDetection={closestCenter}
//       onDragEnd={handleDragEnd}
//     >
//       <SortableContext items={items} strategy={verticalListSortingStrategy}>
//         {items.map((id) => (
//           <SortableItem key={id} id={id} />
//         ))}
//       </SortableContext>
//     </DndContext>
//   );
// }

// export default App;

// export function SortableItem({ id }: SortableItemProps) {
//   const { attributes, listeners, setNodeRef, transform, transition } =
//     useSortable({ id: id.toString() });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//     background: "red",
//     margin: "1rem",
//   };

//   return (
//     <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
//       {id}
//     </div>
//   );
// }

// import { useState } from "react";
// import { DndContext, DragEndEvent } from "@dnd-kit/core";
// import { useDroppable } from "@dnd-kit/core";
// import { useDraggable } from "@dnd-kit/core";
// import { CSS } from "@dnd-kit/utilities";

// interface DraggableProps {
//   id: string;
//   children: React.ReactNode;
// }

// interface DroppableProps {
//   id: string;
//   children: React.ReactNode;
// }

// // () => <Sortable {...props} handle />

// function Example() {
//   const [parent, setParent] = useState<string | null>(null);
//   const draggable = <Draggable id="draggable">Go ahead, drag me.</Draggable>;

//   const handleDragEnd = (event: DragEndEvent) => {
//     setParent(event.over ? event.over.id : null);
//   };

//   return (
//     <DndContext onDragEnd={handleDragEnd}>
//       {!parent ? draggable : null}
//       <Droppable id="droppable">
//         {parent === "droppable" ? draggable : "Drop here"}
//       </Droppable>
//     </DndContext>
//   );
// }

// export default Example;

// function Draggable({ id, children }: DraggableProps) {
//   const { attributes, listeners, setNodeRef, transform } = useDraggable({
//     id,
//   });
//   const style = {
//     transform: CSS.Translate.toString(transform),
//   };

//   return (
//     <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
//       {children}
//     </button>
//   );
// }

// export function Droppable({ id, children }: DroppableProps) {
//   const { isOver, setNodeRef } = useDroppable({
//     id,
//   });
//   const style = {
//     opacity: isOver ? 1 : 0.5,
//   };

//   return (
//     <div ref={setNodeRef} style={style}>
//       {children}
//     </div>
//   );
// }
