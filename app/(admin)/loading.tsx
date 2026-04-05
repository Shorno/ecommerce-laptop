import {Spinner} from "@/components/ui/spinner";

export default function Loading(){
    return (
        <div className={"flex justify-center items-center min-h-[calc(100vh-120px)]"}>
            <Spinner className={"sm:size-8 size-10"}/>
        </div>
    )
}