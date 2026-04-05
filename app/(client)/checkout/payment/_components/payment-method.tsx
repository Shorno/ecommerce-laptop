import {Card, CardContent} from "@/components/ui/card";
import {FieldGroup, FieldLabel, FieldSet} from "@/components/ui/field";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import Image from "next/image";

export default function PaymentMethod() {
    return (
        <Card className="mb-4">
            <CardContent className="pt-6">
                <FieldGroup>
                    <FieldSet>
                        <FieldLabel htmlFor="payment-method" className="mb-3">
                            Payment Method
                        </FieldLabel>
                        <RadioGroup defaultValue="bkash" className="flex gap-3">
                            <FieldLabel htmlFor="bkash" className="cursor-pointer">
                                <div
                                    className="relative  w-full h-auto rounded-lg border-2 border-muted  hover:border-primary/50 transition-colors flex items-center justify-center overflow-hidden has-[:checked]:border-primary has-[:checked]:border-4 p-3"
                                >
                                    <Image
                                        src="/logos/bkash.png"
                                        alt="bKash"
                                        width={80}
                                        height={40}
                                        className="object-contain w-full h-auto"
                                    />
                                    <RadioGroupItem
                                        value="bkash"
                                        id="bkash"
                                        className="absolute top-2 right-2"
                                    />
                                </div>
                            </FieldLabel>
                            <FieldLabel htmlFor="nagad" className="cursor-pointer">
                                <div
                                    className="relative rounded-lg border-2 border-muted bg-background hover:border-primary/50 transition-colors flex items-center justify-center overflow-hidden has-[:checked]:border-primary has-[:checked]:border-4 p-0">
                                    <Image
                                        src="/logos/rocket.png"
                                        alt="Rocket"
                                        width={80}
                                        height={40}
                                        className="object-contain w-full h-auto"
                                    />
                                    <RadioGroupItem
                                        value="nagad"
                                        id="nagad"
                                        className="absolute top-2 right-2"
                                    />
                                </div>
                            </FieldLabel>
                        </RadioGroup>
                    </FieldSet>
                </FieldGroup>
            </CardContent>
        </Card>
    )
}
