import React, { Component } from "react";
import { StyleSheet, Text, View, Image, ScrollView, Alert,
         TouchableOpacity, CameraRoll, Dimensions,
         FlatList } from "react-native";
import SvgUri from "react-native-svg-uri";

import ImageView from "./ImageView/image-view";
import { DefaultStyles, Rules } from "../../Const/const";
import { IconChevronLeft } from "../../../icons/icons";

export default class ImagePicker extends Component {
  constructor(props) {
    super(props);
    this.state = { photos: [],
                   selected: [],
                   end_cursor: null,
                   has_next_page: null,
                   existsCount: this.props.existsCount === undefined ? 0 : this.props.existsCount,
                   readyToGetPhotos: true, };

    this.windowWidth = Dimensions.get("window").width;
    this.photoSize = (this.windowWidth - 3*3) / 4;
    this.maxPhotos = this.props.maxPhotos === undefined ? Rules.maxPhotosPerRecipe : this.props.maxPhotos;
  }

  componentDidMount() {
    this.loadPhotos();
  }

  loadPhotos = () => {
    if (this.state.has_next_page === null || this.state.has_next_page === true) {
      this.setState({ readyToGetPhotos: false });
      let params = { first: 24,
                     groupTypes: "All",
                     assetType: "All", };
      if (this.state.end_cursor !== null)
        params["after"] = this.state.end_cursor;

      CameraRoll.getPhotos(params).then(result => {
        let newPhotos = result.edges;

        let duplicated = false;
        if (this.state.photos.length > 0)
        for (let i = 0; i < newPhotos.length; ++i)
          if (newPhotos[i].node.image.uri === this.state.photos[0].node.image.uri) {
            duplicated = true;
            if (i > 0) {
              newPhotos = newPhotos.slice(0, i);
              this.setState({ photos: this.state.photos.concat(newPhotos), });
            }
            break;
          }

        if (!duplicated) {
          let newState_photos = this.state.photos.concat(newPhotos);
          this.setState({ photos: newState_photos,
                          end_cursor: result.page_info.end_cursor,
                          has_next_page: result.page_info.has_next_page,
                          readyToGetPhotos: true, });
        }
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
          <TouchableOpacity onPress={this.props.handleClose} style={styles.option}>
            <SvgUri svgXmlData={IconChevronLeft} fill={DefaultStyles.standardBlue} width="20" height="20"/>
          </TouchableOpacity>
          <Text style={styles.title}>{this.state.selected.length === 0 ? "Select" : this.state.selected.length.toString()+" Selected"}</Text>
          <TouchableOpacity onPress={this.onSubmit} style={styles.option}>
            <Text style={[{ textAlign: "right", fontWeight: "600", color: DefaultStyles.standardBlue }]}>Done</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.body, { marginBottom: this.photoSize*2+3*2 }]}>
          <FlatList horizontal={false} numColumns={4}
                    data={this.state.photos}
                    extraData={this.state.selected}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={ ({item, index}) => <ImageView index={index} uri={item.node.image.uri} size={this.photoSize} style={[styles.photo, { marginTop: index < 4 ? 0 : 3 }]}
                                                               selectToggler={this.selectPhotoHandler} selected={this.state.selected.includes(index)}/> }
                    onEndReached={this.state.readyToGetPhotos && this.loadPhotos}/>
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
    backgroundColor: DefaultStyles.headerStandardColor,
    width: "100%",
    height: DefaultStyles.headerHeight,
    paddingTop: DefaultStyles.headerPaddingTop,
    paddingRight: DefaultStyles.standardPadding,
    paddingLeft: DefaultStyles.standardPadding,
    borderBottomWidth: 0.5,
    borderBottomColor: DefaultStyles.standardBlack,
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
    justifyContent: "center",
    width: 50,
    height: 50,
  },
  photo: {
    marginRight: 3,
  },
})
