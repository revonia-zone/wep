import {useContext, useEffect, useState} from "react";
import {container} from "tsyringe";
import {EventUnit} from "./EventUnit";

export function useUnitContainer() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const eventUnit = container.resolve(EventUnit)
    const cb = () => {
      setTick((tick) => tick + 1)
    }
    eventUnit.addEventListener('wep:unit:update', cb)
    return () => {
      eventUnit.removeEventListener('wep:unit:update', cb)
    }
  }, []);

  return container
}
