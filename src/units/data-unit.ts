import {injectable, singleton} from "tsyringe";
import {EventUnit} from "./event-unit";

@injectable()
@singleton()
export class DataUnit {
  constructor(
    private eventUnit: EventUnit
  ) {
  }

  writeSessionData(key: string, data: any) {
    sessionStorage.setItem(`data:${key}`, JSON.stringify(data))
  }

  readSessionData(key: string, defaultData: any = null) {
    const data = sessionStorage.getItem(`data:${key}`)
    return data === null ? defaultData : JSON.parse(data)
  }
}
