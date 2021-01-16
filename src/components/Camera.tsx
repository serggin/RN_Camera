import React from 'react';
import {BarCodeReadEvent, RNCamera} from 'react-native-camera';

interface ICameraProps {
    onStatusChange? : (status: string) => void;
    onBarCodeRead? : (barCodeResult: IBarCodeResult) => void;
}

export interface IBarCodeResult {
    data: BarCodeReadEvent['data'];
    type: BarCodeReadEvent['type'];
}

const Camera: React.FC<ICameraProps> = (props) => {
    console.log(RNCamera.Constants.CameraStatus);
    return (
        <RNCamera
            ref={ref => {
                // @ts-ignore
                this.camera = ref;
            }}
            captureAudio={false}
            style={{flex: 1}}
            type={RNCamera.Constants.Type.back}
            onStatusChange={({cameraStatus}) => {
                console.log('cameraStatus', cameraStatus);
                props.onStatusChange(cameraStatus);
            }}
            onGoogleVisionBarcodesDetected={({barcodes}) => {console.log(barcodes)}}
            onCameraReady={() => {console.log('Camera Ready')}}
            onBarCodeRead={(event) => {
                console.log('Camera Ready event', event);
                const barCodeResult: IBarCodeResult = event;
                props.onBarCodeRead(barCodeResult);
            }}
            androidCameraPermissionOptions={{
                title: 'Permission to use camera',
                message: 'We need your permission to use your camera',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel',
            }}
        />
    );
}

export default Camera;
