/**
 * Taken from @link https://github.com/trufflehq/truffle-packages/tree/truffle-sdk-draggable/npm/sdk/examples/react-draggable
 * Fixed up a few TypeScript issues, so the file is slightly different
 * Also changed the sizing/styling slightly
 */

import React from 'react';
import { useEffect, useState } from 'react';
import { embed } from '@trufflehq/sdk';
export interface Vector {
  x: number;
  y: number;
}

export interface DragInfo {
  current: Vector;
  start: Vector;
  pressed: boolean;
  draggable: boolean;
}

export interface Modifiers {
  top: number;
  right: number;
  bottom: number;
  left: number;
  transition?: string; //css value for the transition property
}

export interface Dimensions {
  base: Vector;
  modifiers: Modifiers;
  size?: { width: number; height: number };
}

function createIframeStyle(
  dimensions: Dimensions,
  dragInfo: DragInfo
): React.CSSProperties {
  function createClipPath(
    position: Vector,
    base: Vector,
    { top, right, bottom, left }: Modifiers
  ) {
    return `inset(
					${position.y - top}px
					calc(100% - ${position.x + base.x + right}px) 
					calc(100% - ${position.y + base.y + bottom}px) 
					${position.x - left}px)`;
  }
  //creates an element that spans the entire screen
  //a clip path is used to crop to only the actual component
  const style: React.CSSProperties = {
    width: dimensions.size?.width ?? '100%',
    height: dimensions.size?.height ?? '100%',
    clipPath: createClipPath(
      dragInfo.current,
      dimensions.base,
      dimensions.modifiers
    ),
    transition: dimensions.modifiers.transition,
    cursor: dragInfo.pressed ? 'grab' : 'auto',
    background: 'none',
    zIndex: '999',
    pointerEvents: 'all',
  };
  //remove clip path if mouse is pressed or if the user is currently moused down on a non draggable item
  // this gives us mouse events across the entire page so we don't lose a mouse up event
  if (dragInfo.pressed || !dragInfo.draggable) style['clipPath'] = 'none';
  return style;
}

export default function Draggable({
  children,
  dimensions,
  defaultPosition,
  requiredClassName,
  ignoreClassName,
  className = '',
}: {
  children: React.ReactNode;
  dimensions: Dimensions;
  defaultPosition: Vector;
  requiredClassName?: string; //elements must have this classname to be used to drag
  ignoreClassName?: string; //elements with this classname cannot be used to drag
  className?: string;
}) {
  const [dragInfo, setDragInfo] = useState<DragInfo>({
    current: defaultPosition,
    start: { x: 0, y: 0 },
    pressed: false,
    draggable: true,
  });

  useEffect(() => {
    const handleWindowMouseMove = (event: MouseEvent) => {
      setDragInfo((old: DragInfo) => ({
        ...old,
        current: {
          x: event.clientX - old.start.x,
          y: event.clientY - old.start.y,
        },
      }));
    };
    if (dragInfo.pressed) {
      window.addEventListener('mousemove', handleWindowMouseMove);
    } else {
      window.removeEventListener('mousemove', handleWindowMouseMove);
    }
    return () => window.removeEventListener('mousemove', handleWindowMouseMove);
  }, [dragInfo.pressed]);

  // use jumper to update the clip path based on the dimensions and drag info
  useEffect(() => {
    const style = createIframeStyle(dimensions, dragInfo);
    embed.setStyles(style as Record<string, unknown>);
  }, [dimensions, dragInfo]);

  return (
    //outer div is the full screen div that is cropped with clip path
    <div
      className={`draggable ${className}`}
      draggable={true}
      style={createIframeStyle(dimensions, dragInfo)}
      onMouseDown={(e) => {
        const target = e.target as HTMLDivElement;
        const classes: string = target.className;
        if (requiredClassName && !classes.includes(requiredClassName)) {
          setDragInfo((old: DragInfo) => ({ ...old, draggable: false }));
        }
        //prevent dragging by links and any class with the ignoreClassName tag
        if (
          target.tagName === 'A' ||
          (ignoreClassName && classes.includes(ignoreClassName))
        ) {
          setDragInfo((old: DragInfo) => ({ ...old, draggable: false }));
        }
      }}
      onDragStart={(e) => {
        e.preventDefault();
        if (dragInfo.draggable) {
          setDragInfo((old: DragInfo) => ({
            ...old,
            pressed: true,
            start: {
              x: e.clientX - old.current.x,
              y: e.clientY - old.current.y,
            },
          }));
        }
      }}
      onMouseUp={() => {
        setDragInfo((old: DragInfo) => ({
          ...old,
          pressed: false,
          draggable: true,
        }));
      }}
    >
      <div
        style={{
          //set position of child container
          width: 'fit-content',
          position: 'absolute',
          top: dragInfo.current.y,
          left: dragInfo.current.x,
          //disable text selection while dragging
          userSelect: dragInfo.pressed ? 'none' : 'inherit',
        }}
      >
        {children}
      </div>
    </div>
  );
}
