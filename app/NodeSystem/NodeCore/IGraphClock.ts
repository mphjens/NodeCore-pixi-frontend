
export abstract class IGraphClock{
    public abstract GetMillis():number;
    public GetSeconds():number{
        return this.GetMillis()/1000;
    }
    public GetMinutes():number{
        return this.GetSeconds()/60;
    }
}