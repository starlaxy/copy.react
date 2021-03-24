import config from "../../components/Environment"

const API_PROJECT_ROOT = config.API_SERVER + config.API_PROJECT_NAME

const toJson = async (res) => {
    const json = await res.json();
    if(res.ok){
        return json;
    }else{
        throw new Error(json.message);
    }
}

// プロジェクト一覧取得
export const getProject = async () =>{
    const res = await fetch(API_PROJECT_ROOT, {
        method: 'GET',
    })
    return await toJson(res);
}

// 登録
export const createProject = async (data) =>{
    const res = await fetch(API_PROJECT_ROOT, {
        headers:{
            'Content-type':'application/json'
        },
        method: 'POST',
        body: JSON.stringify(data),
    })
    return await toJson(res);
}

// 削除
export const deleteProject = async (id) =>{
    const res = await fetch(API_PROJECT_ROOT + id, {
        method: 'DELETE',
    })
    return await toJson(res);
}