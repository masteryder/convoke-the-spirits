import {RefObject, useEffect, useRef, useState} from "react";

export function useAsyncReference <T>(value:T, isProp = false): [RefObject<T>, (newValue: T)=>void] {
    const ref = useRef<T>(value);
    const [, forceRender] = useState(false);

    function updateState(newState:T) {
        if (!Object.is(ref.current, newState)) {
            ref.current = newState;
            forceRender(s => !s);
        }
    }

    return [ref, updateState];
}

