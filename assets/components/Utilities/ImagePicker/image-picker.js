import React, { Component } from "react";
import { StyleSheet, Text, View, Image, ScrollView, Alert,
         TouchableOpacity, CameraRoll, Dimensions,
         FlatList } from "react-native";

import ImageView from "./ImageView/image-view";
import { DefaultStyles, Rules } from "../../Const/const";

export default class ImagePicker extends Component {
  constructor(props) {
    super(props);
    this.state = { photos: [],
                   selected: [],
                   end_cursor: null,
                   has_next_page: null,
                   existsCount: this.props.existsCount === undefined ? 0 : this.props.existsCount };

    this.windowWidth = Dimensions.get("window").width;
    this.photoSize = (this.windowWidth - 3*3) / 4;
    this.maxPhotos = this.props.maxPhotos === undefined ? Rules.maxPhotosPerRecipe : this.props.maxPhotos;
  }

  componentDidMount() {
    this.loadPhotos();
  }

  loadPhotos = () => {
    if (this.state.has_next_page === null || this.state.has_next_page === true) {
      let params = { first: 4,
                     assetType: "All", };
      if (this.state.end_cursor !== null)
        params["after"] = this.state.end_cursor;

      CameraRoll.getPhotos(params).then(result => {
        let currentLength = this.state.photos.length;
        let newPhotos = result.edges.map((item, index) => {
          item["key"] = index + currentLength;
          return item;
        })
        let newState_photos = this.state.photos.concat(newPhotos);
        this.setState({ photos: newState_photos,
                        end_cursor: result.page_info.end_cursor,
                        has_next_page: result.page_info.has_next_page, });
      });
    }
  }

  selectPhotoHandler = (index) => {
    let newState = this.state.selected;
    if (newState.includes(index)) {
      this.setState({ selected: newState.filter(item => item !== index) });
    }
    else if (newState.length < this.maxPhotos - this.state.existsCount) {
      this.setState({ selected: newState.concat([index]) });
    }
  }

  onSubmit = () => {
    let selectedPhotos = [];
    for (var i = 0; i < this.state.selected.length; ++i)
      selectedPhotos.push(this.state.photos[this.state.selected[i]]);

    this.props.onSubmit(selectedPhotos);
  }

  render() {
    return(
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={this.props.handleClose}>
            <Text style={[styles.option, { textAlign: "left" }]}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{this.state.selected.length === 0 ? "Select" : this.state.selected.length.toString()+" Selected"}</Text>
          <TouchableOpacity onPress={this.onSubmit}>
            <Text style={[styles.option, { textAlign: "right" }]}>Done</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.body}>
          <FlatList horizontal={false} numColumns={4}
                    data={this.state.photos}
                    extraData={this.state.selected}
                    renderItem={ ({item, index}) => <ImageView index={index} uri={item.node.image.uri} size={this.photoSize} style={styles.photo}
                                                               selectToggler={this.selectPhotoHandler} selected={this.state.selected.includes(index)}/> }
                    onEndReached={this.loadPhotos}/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {

  },
  header: {
    // flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#e8e8e8",
    width: "100%",
    height: 60,
    paddingRight: 20,
    paddingLeft: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#d0d0d0",
  },
  body: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    width: "100%",
  },
  title: {
    fontSize: DefaultStyles.headerFontSize,
    fontWeight: "600",
    textAlign: "center",
  },
  option: {
    width: 50,
  },
  photo: {
    marginTop: 3,
    marginRight: 3,
  }
})
