import ApiCaller, { methods } from "./api-caller";

export const filterPageData = async ({create_new_array = false,state,data,page,countRoute,data_to_send = {}}) =>{
    let obj;

    if(state != null && !create_new_array){
        obj = {
            ...state,
            results : [ ...state.results, ...data],
            page:page
        }
    }else{
        let promise = new ApiCaller(countRoute,methods.post,{...data_to_send});
        let response = await promise;
        obj  = {
            results : data,
            page: 1,
            totalDocs:response.data
        };
    }

    return obj;
}