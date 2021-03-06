<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePhoto extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            //ファイル形式指定
            'photo' => 'required|file|mimes:jpg,jpeg,png,gif',
            //コメントの指定
            'comment' => 'required|max:50'
        ];
    }
}
