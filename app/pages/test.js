import React, { Component } from 'react';
import {
    View, StyleSheet,
    Image,
    Dimensions,
    Animated,
    Text,
    CameraRoll,
    ScrollView
} from 'react-native';

/**
 * 霾效果
 * 
 * @export
 * @class Haze
 * @extends {Component}
 */
export default class Haze extends Component {
    constructor(props) {
        super(props);
        this.state = {
            images: []
        }
    }

    componentDidMount() {
        CameraRoll.getPhotos({ first: 1000 }).then((data) => {
            const assets = data.edges;
            const images = assets.map((asset) => asset.node.image);
            this.setState({
                images: images,
            });
        });
    }
    render() {
        return (
            <ScrollView>
            <View style={styles.container} >

                {
                    this.state.images.map((item, index) => {
                        return (<Image key={index} style={styles.image} source={{ uri: item.uri }} />)
                    })
                }
            </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    haze: {
        width: 20,
        height: 20,
        position: 'absolute',
        backgroundColor: '#999',
        borderRadius: 20
    },
    image: {
        height: (Dimensions.get('window').width - 40)/2,
        width: (Dimensions.get('window').width - 40)/2,
        margin: 10
    }
});

