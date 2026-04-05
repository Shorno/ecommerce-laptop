import {Loader} from "lucide-react";

export default function Loading(){
    return (
        <div className={"min-h-[calc(100dvh-130px)] w-full flex justify-center items-center"}>
            <Loader className={"animate-spin"}/>
        </div>
    )
}