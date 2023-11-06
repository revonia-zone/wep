import {injectable, singleton} from "tsyringe";
import { TypedEventEmitter} from "@libp2p/interface/events";
import {AppInstance} from "./app-manage-unit";

interface EventMap {
  'libmemo:app-manage:activate': CustomEvent<AppInstance>
  'libmemo:app-manage:deactivate': CustomEvent<AppInstance>
}

@injectable()
@singleton()
export class EventUnit extends TypedEventEmitter<EventMap>  {
}

