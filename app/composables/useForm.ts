import { reactive, ref } from "vue";
import { FetchError } from 'ofetch';

export default function useForm<
	TFormData extends Record<string, unknown>,
	TApiResult
>(
	apiFn: (args: TFormData | FormData) => Promise<TApiResult>,
	formData: TFormData,
	onSuccess?: (args: TApiResult) => void,
	asFormData: boolean = false
) {

	const form = reactive(formData);
	const errors = ref<Record<keyof TFormData, string | undefined> | Record<string, string>>({});
	const notice = ref<string | null>(null);
	const pending = ref(false);
	const success = ref(false);

	function toFormData(obj: Record<string, unknown>): FormData {
		const fd = new FormData();

		Object.entries(obj).forEach(([key, value]) => {
			if (Array.isArray(value)) {
				value.forEach((v) => fd.append(key + '[]', v));
			} else if (value instanceof File || value instanceof Blob) {
				fd.append(key, value);
			} else if (value instanceof Date) {
				// Отправляем только дату, без времени (если нужно ISO - можно заменить)
				fd.append(key, value.toISOString().split('T')[0]);
			} else if (value !== undefined && value !== null) {
				fd.append(key, String(value));
			}
		});

		return fd;
	}

	async function send() {
		errors.value = {};
		notice.value = null;
		pending.value = true;
		success.value = false;

		try {
			const payload = asFormData ? toFormData(form) : form;
			const res = await apiFn(payload as any);
			success.value = true;
			onSuccess?.(res);

		} catch (e) {
			if (e instanceof FetchError) {
				const error = e.data as Error;
				console.log(error.message);

				errors.value = error.error;
			} else {
				notice.value = 'Непредвиденная ошибка на сервере';
			}
		} finally {
			pending.value = false;
		}
	}

	return {
		form,
		errors,
		notice,
		send,
		pending,
		success,
	};
}

interface Error {
	success: false;
	message: string | null;
	error: Record<string, string[]>;
}

interface Success {
	success: true;
	message: string | null;
}
