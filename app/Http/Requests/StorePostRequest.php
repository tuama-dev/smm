<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePostRequest extends FormRequest
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
            'caption' => ['nullable', 'string', 'max:5000'],
            'scheduled_at' => ['nullable', 'date', 'after:now'],
            'media_ids' => ['nullable', 'array'],
            'media_ids.*' => ['string', 'exists:media,id'],
            'status' => ['required', 'in:draft,scheduled'],
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
            'caption.max' => 'Caption must not exceed 5000 characters.',
            'scheduled_at.after' => 'Scheduled time must be in the future.',
            'media_ids.*.exists' => 'One or more selected media files are invalid.',
            'status.in' => 'Status must be either draft or scheduled.',
        ];
    }
}
