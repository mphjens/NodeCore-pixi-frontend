import { IGraphClock } from "./IGraphClock";

export class GraphSystemClock extends IGraphClock{
    public GetMillis(): number {
        return Date.now();
    }

}