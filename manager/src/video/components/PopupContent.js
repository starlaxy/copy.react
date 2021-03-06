import React, { useEffect, useState } from 'react';
import config from '../../common/components/Environment';
import CloseIcon from '../../images/video/close-icon.png';
import DummyImg from '../../images/video/dummy_img.png';
import classes from '../css/PopupContent.module.css';



export const PopupContent = (props) => {

    const [imgSrc, setImgSrc] = useState();

    // popup_img変更時にソースセット
    useEffect(() => {
        if(!props.popup_img) {
            setImgSrc(DummyImg);
        }
        else if(typeof(props.popup_img) == 'object'){
            let reader = new FileReader();
            reader.onload = (e) => {
                setImgSrc(e.target.result)
            };
            reader.readAsDataURL(props.popup_img);
        }
        else {
            setImgSrc(config.API_SERVER + props.popup_img);
        }
    }, [props.popup_img])

    /**
     *画像、テキスト表示
     * @return {JSX} POPUP TYPEに沿った情報 
     */
    const renderContent = () => {
        switch (props.popup_type) {
            case 'default':
                return (
                    <div className={classes.default}>
                        <div className={classes.defaultImgContent}>
                            <img src={imgSrc} alt='popup画像' />
                        </div>
                        <div className={classes.defaultTextContent}>
                            <p>{props.popup_text}</p>
                            {renderLinkBtn()}
                        </div>
                    </div>
                )

            case 'vertical':
                return (
                    <div className={classes.vertical}>
                        <div className={classes.verticalImgContent}>
                            <img src={imgSrc} alt='popup画像' />
                        </div>
                        <div className={classes.verticalImgContent}>
                            <p>{props.popup_text}</p>
                        </div>
                        {renderLinkBtn()}
                    </div>
                )

            default:
                return (
                    <div className={classes.text}>
                        <p>{props.popup_text}</p>
                        {renderLinkBtn()}
                    </div>
                )
        }
    }

    /**
     *LINKボタン描画
     *
     * @return {*} 
     */
    const renderLinkBtn = () => {
        if(props.popup_btn_text !== '' && props.popup_btn_text !== null){
            return (
                <div className={classes.btnArea}>
                    <button className={classes.btn} onClick={() => popupBtnLink()}>{props.popup_btn_text}</button>
                </div>
            )
        }
    }

    /**
     *POPUP内ボタン押下イベント
     */
    const popupBtnLink = () => {
        window.open(props.popup_btn_url, '_blank');
    }

    /**
     *POPUP閉じるボタン押下イベント
     */
    const closePopup = () => {
        props.setIsDisplayPopup(false);
    }

    return (
        <div className={classes.popupArea}>
            {renderContent()}
            <img src={CloseIcon} alt='popup閉じるボタン' className={classes.closeIcon} onClick={() => closePopup()} />
        </div>
    )
}