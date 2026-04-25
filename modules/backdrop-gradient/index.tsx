import React from 'react'
import { cn } from '@/lib/utils';

type Props = {
    children: React.ReactNode;
    classname?: string;
    container?: string;
}

const BackdropGradient = ({ children, classname, container }: Props) => {
    return (
        <div className={cn("relative w-full flex flex-col", container)}>
            <div className={cn("absolute rounded-[50%] radial--blur mx-10", classname)}>
                {children}
            </div>
        </div>
    )
}

export default BackdropGradient