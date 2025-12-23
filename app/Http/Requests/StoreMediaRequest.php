<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMediaRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = $this->user();
        $team = $user?->currentTeam;

        if (! $team) {
            return false;
        }

        // User must be a member of the current team
        return $team->members()->where('user_id', $user->id)->exists();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'file' => [
                'required',
                'file',
                'mimes:jpg,jpeg,png,gif,webp,mp4,mov,webm',
                'max:102400', // 100MB
            ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'file.required' => 'Please select a file to upload.',
            'file.file' => 'The uploaded file is invalid.',
            'file.mimes' => 'The file must be an image (jpg, png, gif, webp) or video (mp4, mov, webm).',
            'file.max' => 'The file size must not exceed 100MB.',
        ];
    }
}
