import React, { useState, useRef } from 'react';
import { createTag } from '../api/tag';
import { Transition } from 'react-transition-group';

import { TagValidator } from '../validator/TagValidator'

import { initialTagState, initialTagErrors } from '../components/InitialState'

import classes from '../css/TagForm.module.css'

export const TagForm = (props) => {
    
    const nodeRef = useRef();

    // タグフォームアニメーション
    const [mount, setMount] = useState(false);
    const transitionStyle = {
        entering: {
            maxHeight: '100vh',
            transition: 'all 1s ease',
        },
        entered: {
            maxHeight: '100vh',
            transition: 'all 1s ease',
        },
        exiting: {
            maxHeight: 0,
            transition: 'all 1s ease',
        },
        exited: {
            maxHeight: 0,
            transition: 'all 1s ease',
        },
    };

    const [tagErrors, setTagErrors] = useState(initialTagErrors);

    /**
     *タグ作成ボタン押下時、TagForm表示
     */
    const handleDisplay = () => {
        setMount(!mount);
    }

    /**
     *フォーム変更時イベント
     *
     * @param {onChange} e
     */
    const handleChange = (e) => {
        let value;
        switch (e.target.name) {
            case "display_frame":
                value = (e.target.value < 0) ? 0 : e.target.value;
                props.changeCurrentFrame(value);
                break;

            case "hide_frame":
                value = (props.totalFrame < e.target.value) ? props.totalFrame : e.target.value;
                props.changeCurrentFrame(value);
                break;

            case "popup_img":
                value = e.target.files[0];
                break;
        
            default:
                value = e.target.value
                break;
        }
        props.setNewTagEleState({
            ...props.newTagEleState,
            [e.target.name]: value
        });
    }

    /**
     *DisplayFrame現在のフレームを設定ボタン押下イベント
     * @param {number} frame
     */
    const setDisplayFrame = (e) => {
        e.preventDefault();
        props.setNewTagEleState({
            ...props.newTagEleState,
            'display_frame': Math.ceil(props.currentFrame)
        })
    }

    /**
     *HideFrame現在のフレームを設定ボタン押下イベント
     * @param {number} frame
     */
     const setHideFrame = (e) => {
        e.preventDefault();
        props.setNewTagEleState({
            ...props.newTagEleState,
            'hide_frame': Math.ceil(props.currentFrame)
        })
    }

    /**
     *領域指定ボタン押下イベント
     * @param {MouseEvent} e
     */
    const handleClickAreaBtn = (e) => {
        e.preventDefault();
        props.changeCurrentFrame(props.newTagEleState.display_frame);
        props.createTagArea(e);
    }

    // タグタイプ毎に入力フォーム変更
    const renderTagTypeCol = () => {
        if (props.newTagEleState.action_type === 'link'){
            return (
                <>
                    <label htmlFor='url' className={classes.inputLabel}>URL</label>
                    {renderErrorMessage(tagErrors.url)}
                    <input
                        id='url'
                        className={`${classes.inputText} ${tagErrors.url ? classes.error : ''}`}
                        type='url'
                        name='url'
                        value={props.newTagEleState.url}
                        onChange={ (e) => handleChange(e) } />
                </>
            )
        }
        else if (props.newTagEleState.action_type === 'popup'){
            return (
                <>
                    <p>テンプレート選択</p>
                    <div className={classes.radioWrap}>
                        <label
                            htmlFor='default'
                            className={`${classes.radioLabel} ${(props.newTagEleState.popup_type === 'default') ? classes.radioChecked : ''}`}>
                            通常
                        </label>
                        <input
                            id='default'
                            className={classes.radioInput}
                            type='radio'
                            name='popup_type'
                            value='default'
                            onChange={ (e) => handleChange(e) }
                            checked={props.newTagEleState.popup_type === 'default'} />
                        <label
                            htmlFor='vertical'
                            className={`${classes.radioLabel} ${(props.newTagEleState.popup_type === 'vertical') ? classes.radioChecked : ''}`}>
                            縦
                        </label>
                        <input
                            id='vertical'
                            className={classes.radioInput}
                            type='radio'
                            name='popup_type'
                            value='vertical'
                            onChange={ (e) => handleChange(e) }
                            checked={props.newTagEleState.popup_type === 'vertical'} />
                        <label
                            htmlFor='text'
                            className={`${classes.radioLabel} ${(props.newTagEleState.popup_type === 'text') ? classes.radioChecked : ''}`}>
                            テキストのみ
                        </label>
                        <input
                            id='text'
                            className={classes.radioInput}
                            type='radio'
                            name='popup_type'
                            value='text'
                            onChange={ (e) => handleChange(e) }
                            checked={props.newTagEleState.popup_type === 'text'} />
                    </div>
                    {renderFileCol()}
                    <label htmlFor='popup-text' className={classes.inputLabel}>表示文字</label>
                    {renderErrorMessage(tagErrors.popup_text)}
                    <input
                        id='popup-text'
                        className={`${classes.inputText} ${(tagErrors.popup_text) ? classes.error : ''}`}
                        type='text'
                        name='popup_text'
                        value={props.newTagEleState.popup_text}
                        onChange={ (e) => handleChange(e) } />
                    <label htmlFor='popup-btn-text' className={classes.inputLabel}>ボタン文字</label>
                    {renderErrorMessage(tagErrors.popup_btn_text)}
                    <input
                        id='popup-btn-text'
                        className={`${classes.inputText} ${(tagErrors.popup_btn_text) ? classes.error : ''}`}
                        type='text'
                        name='popup_btn_text'
                        value={props.newTagEleState.popup_btn_text}
                        onChange={ (e) => handleChange(e) } />
                    <label htmlFor='popup-btn-url' className={classes.inputLabel}>リンクURL</label>
                    {renderErrorMessage(tagErrors.popup_btn_url)}
                    <input
                        id='popup-btn-url'
                        className={`${classes.inputText} ${(tagErrors.popup_btn_url) ? classes.error : ''}`}
                        type='text'
                        name='popup_btn_url'
                        value={props.newTagEleState.popup_btn_url}
                        onChange={ (e) => handleChange(e) } />
                </>
            )
        }
        else {
            return (
                <>
                    <label htmlFor='story-next-video' className={classes.inputLabel}>ストーリー先動画</label>
                    {renderErrorMessage(tagErrors.story_next_video)}
                    <select
                        id='story-next-video'
                        value={props.newTagEleState.story_next_video}
                        className={`${classes.storySelect} ${(tagErrors.story_next_video) ? classes.error : ''}`}
                        name='story_next_video'
                        onChange={ (e) => handleChange(e) }>
                        <option value=''>選択してください</option>
                        {renderStoryVideoCol()}
                    </select>
                    <label htmlFor='story-start-frame' className={classes.inputLabel}>ストーリー開始フレーム</label>
                    {renderErrorMessage(tagErrors.story_start_frame)}
                    <input
                        id='story-start-frame'
                        className={`${classes.inputText} ${(tagErrors.story_start_frame) ? classes.error : ''}`}
                        type='number'
                        name='story_start_frame'
                        value={props.newTagEleState.story_start_frame}
                        onChange={ (e) => handleChange(e) } />
                </>
            )
        }
    }

    /**
     *POPUPTYPEテキスト以外の時にFILEフォーム表示
     * @return {JSX} FILEフォーム
     */
    const renderFileCol = () => {
        if(props.newTagEleState.popup_type !== 'text'){
            return (
                <>
                    <label htmlFor={"popup-img" + props.id} className={classes.inputLabel}>ファイル</label>
                    {renderErrorMessage(tagErrors.popup_img)}
                    <input id='popup-img' type='file' name='popup_img' accept='image/*' onChange={ (e) => handleChange(e) } />
                </>
            )
        }
    }

    /**
     *Story選択肢表示
     * @return {JSX} <option> 
     */
    const renderStoryVideoCol = () => {
        if(props.storyVideo.length){
            const storyVideo = props.storyVideo.map(sv => {
                return <option key={sv.id} value={sv.id}>{sv.title}</option>
            })
            return storyVideo
        }
    }

    /**
     * stateからFormDataを作成し、登録API通信
     * 成功時：親の紐づく動画の全情報を取得し、親のvideostate変更
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        const errorMessages = TagValidator(props.newTagEleState);
        if(Object.values(errorMessages).some(e => e !== '')){
            setTagErrors({...errorMessages});
            return;
        }
        const formData = new FormData();
        formData.append('video', props.mainVideoId);
        formData.append('title', props.newTagEleState.title);
        formData.append('action_type', props.newTagEleState.action_type);
        formData.append('left', props.newTagEleState.left);
        formData.append('top', props.newTagEleState.top);
        formData.append('width', props.newTagEleState.width);
        formData.append('height', props.newTagEleState.height);
        formData.append('display_frame', props.newTagEleState.display_frame);
        formData.append('hide_frame', props.newTagEleState.hide_frame);

        switch (props.newTagEleState.action_type){
            case 'link':
                formData.append('url', props.newTagEleState.url);
                break
            
            case 'popup':
                formData.append('popup_type', props.newTagEleState.popup_type);
                formData.append('popup_text', props.newTagEleState.popup_text);

                if(props.newTagEleState.popup_type !== 'text'){
                    formData.append('popup_img', props.newTagEleState.popup_img, props.newTagEleState.popup_img.name);
                }
                formData.append('popup_btn_text', props.newTagEleState.popup_btn_text);
                formData.append('popup_btn_url', props.newTagEleState.popup_btn_url);
                break;

            default:
                formData.append('story_next_video', props.newTagEleState.story_next_video);
                formData.append('story_start_frame', props.newTagEleState.story_start_frame);
                break;
        }

        createTag(formData)
        .then(t => {
            let newVideo = [...props.video];
            newVideo.find(v => v.id === props.mainVideoId).tags.push(t);
            props.setVideo(newVideo);
            props.setIsCreatingTag(false);
            props.setNewTagEleState(initialTagState);
        })
        .catch(e => {
            throw new Error(e);
        });
    }

    /**
     *エラーがあればエラーメッセージ表示
     * @param {string} message エラーメッセージ
     * @return {JSX} span
     */
    const renderErrorMessage = (message) => {
        if(message){
            return <span className={classes.errorMessage}>{message}</span>
        }
    }

    return(
        <>
            <p onClick={() => handleDisplay()} className={classes.dispBtn}>タグ作成</p>
            <Transition nodeRef={nodeRef} in={mount} timeout={1000} >
                {(state) =>
                    <form ref={nodeRef} style={transitionStyle[state]} className={classes.TagForm}>
                        <label htmlFor='title' className={classes.inputLabel}>タイトル</label>
                        {renderErrorMessage(tagErrors.title)}
                        <input
                            id='title'
                            className={`${classes.inputText} ${tagErrors.title ? classes.error : ''}`}
                            type='text'
                            name='title'
                            value={props.newTagEleState.title}
                            onChange={ (e) => handleChange(e) } />
                        {renderErrorMessage(tagErrors.area)}
                        <button
                            className={`${classes.createAreaBtn} ${tagErrors.area ? classes.error : ''}`}
                            onClick={(e) => handleClickAreaBtn(e)}>
                            領域指定
                        </button>
                        <p className={classes.inputColText}>タグタイプ</p>
                        <div className={classes.radioWrap}>
                            <label
                                htmlFor='link'
                                className={`${classes.radioLabel} ${(props.newTagEleState.action_type === 'link') ? classes.radioChecked : ''}`}>
                                外部リンク
                            </label>
                            <input
                                id='link'
                                className={classes.radioInput}
                                type='radio'
                                name='action_type'
                                value='link'
                                onChange={ (e) => handleChange(e) }
                                checked={props.newTagEleState.action_type === 'link'} />
                            <label
                                htmlFor='popup'
                                className={`${classes.radioLabel} ${(props.newTagEleState.action_type === 'popup') ? classes.radioChecked : ''}`}>
                                ポップアップ
                            </label>
                            <input
                                id='popup'
                                className={classes.radioInput}
                                type='radio'
                                name='action_type'
                                value='popup'
                                onChange={ (e) => handleChange(e) }
                                checked={props.newTagEleState.action_type === 'popup'} />
                            <label
                                htmlFor='story'
                                className={`${classes.radioLabel} ${(props.newTagEleState.action_type === 'story') ? classes.radioChecked : ''}`}>
                                ストーリー
                            </label>
                            <input
                                id='story'
                                className={classes.radioInput}
                                type='radio'
                                name='action_type'
                                value='story'
                                onChange={ (e) => handleChange(e) }
                                checked={props.newTagEleState.action_type === 'story'} />
                        </div>
                        { renderTagTypeCol() }
                        <label htmlFor='display-frame' className={classes.inputLabel}>開始フレーム</label>
                        {renderErrorMessage(tagErrors.display_frame)}
                        <input
                            id='display-frame'
                            className={`${classes.inputText} ${tagErrors.display_frame ? classes.error : ''}`}
                            type='number'
                            name='display_frame'
                            value={props.newTagEleState.display_frame}
                            onChange={ (e) => handleChange(e) } />
                        <button className={classes.setCurrentFrameBtn} onClick={(e) => setDisplayFrame(e)} >現在のフレームを設定</button>
                        <label htmlFor='hide-frame' className={classes.inputLabel}>終了フレーム</label>
                        {renderErrorMessage(tagErrors.hide_frame)}
                        <input
                            id='hide-frame'
                            className={`${classes.inputText} ${tagErrors.hide_frame ? classes.error : ''}`}
                            type='number'
                            name='hide_frame'
                            value={props.newTagEleState.hide_frame}
                            onChange={ (e) => handleChange(e) } />
                        <button className={classes.setCurrentFrameBtn} onClick={(e) => setHideFrame(e)}>現在のフレームを設定</button>
                        <div className={classes.submitBtnWrap}>
                            <button className={classes.submitBtn} onClick={ (e) => handleSubmit(e) }>登録</button>
                        </div>
                    </form>
                
                }
            </Transition>
        </>
    )
}