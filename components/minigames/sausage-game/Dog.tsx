import { Coordinate } from "@/dtos/GestureEventType";
import { Leaf } from "phosphor-react-native";
import { Fragment } from "react";
import { StyleSheet, View } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";

interface DogProps {
    dog: Coordinate[];
}

export default function Dog ({ dog }: DogProps):JSX.Element {
    return (
        <Fragment>
            {dog.map((segment: Coordinate, index:number) => {
                const segmentStyle = {
                    left: segment.x *10,
                    top: segment.y*10,
                }
                return <View key={index} style={[styles.dog, segmentStyle]} />
            })}
        </Fragment>
    )
}

const styles = StyleSheet.create({
    dog: {
        width: 15,
        height: 15,
        borderRadius: 7,
        backgroundColor: Colors.primary,
        position: 'absolute',
    }
})