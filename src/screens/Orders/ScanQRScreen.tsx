import React from 'react';
import {SafeAreaView, StyleSheet, Text, View, Image, Platform} from 'react-native';
import colors from '../../constants/colors';
import ApplicationStyles from '../../constants/styles';
import Button from '../../components/Button';
import Camera, {IBarCodeResult} from "../../components/Camera";
import {RNCamera} from "react-native-camera";
import {useNavigation} from "@react-navigation/native";

const ScanQRScreen = () => {
  const [state, setState] = React.useState({
    ready: true,
    barCodeResult: null,
  });
  const navigation = useNavigation();

  const onBarCodeRead = (barCodeResult: IBarCodeResult) => {
    console.log('barCode type=', barCodeResult.type);
    console.log('barCode data=', barCodeResult.data);
    setState({...state, barCodeResult});
  }

  return (
    <SafeAreaView style={ApplicationStyles.flex}>
      <View style={{ marginHorizontal: 20, flex:1 }}>
        <Text style={styles.title}>Поднесите QR-код покупателя</Text>
        <View style={{borderRadius: 10, marginHorizontal: 50, flex: 1}}>
          {state.ready && !state.barCodeResult &&
            <Camera onStatusChange={
              (status) => {
                console.log(status, RNCamera.Constants.CameraStatus.NOT_AUTHORIZED);
                if (status === "NOT_AUTHORIZED") {
                  setState({...state, ready: false});
                  console.log('NOT_AUTHORIZED');
                }
              }
            }
                    onBarCodeRead = {onBarCodeRead}
            />
          }
          {!state.ready &&
            <Text style={styles.noCamera}>Отсутствует доступ к камере</Text>
          }
          {state.barCodeResult &&
            <>
              <Text>barCode type: {state.barCodeResult.type}</Text>
              <Text>barCode type: {JSON.stringify(state.barCodeResult.data)}</Text>
            </>
          }
        </View>
        <View style={{ marginBottom: 15, marginTop: 25 }}>
          <Button
            active={true}
            containerStyle={{ backgroundColor: 'rgba(32, 81, 163, 0.05)' }}
            textStyle={{ color: colors.primary }}
            text='Отмена'
            onPress={() => {
              navigation.navigate("Orders");
            }}
          />
        </View>
        <View style={ApplicationStyles.absoluteCenter}>
          <Image source={require('../../../assets/qr-border.png')} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ScanQRScreen;

const styles = StyleSheet.create({
  topSpacer: {
    height: 3,
    width: 40,
    backgroundColor: colors.primary,
    opacity: 0.2,
    alignSelf: 'center',
    marginTop: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 21.48,
    color: colors.dark,

    marginBottom: 25,
  },
  image: {
    borderRadius: 15,
  },
  noCamera: {
    fontSize: 16,
    lineHeight: 19,
    marginTop: 15,
    color: colors.dark,
    textAlign: 'center',
    ...Platform.select({
      ios: {
        fontWeight: '600',
      },
      android: {
        fontWeight: '700',
      },
    }),
  },
});
