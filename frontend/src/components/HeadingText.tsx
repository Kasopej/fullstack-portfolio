import clsx from "clsx";
import { Slot } from "radix-ui";
import { JSX } from "react";

type Props = JSX.IntrinsicElements['div']
export default function HeadingText(props: Props) {

    return (
        <Slot.Root className={clsx("text-contrast-foreground font-bold", props.className)}>
            {props.children}
        </Slot.Root>
    )
}