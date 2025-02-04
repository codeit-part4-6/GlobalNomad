import {useFieldArray, useForm, Controller, useFormContext} from 'react-hook-form';
import Input from '../common/Input';
import SelectBox from '../common/selectbox';
import {findOverlappingSchedules, generateTimeOptions} from '@/service/lib/fotmatted-hour-time';
import Image from 'next/image';
import minusBtn from '@/public/icon/ic_minus_btn.svg';
import plusBtn from '@/public/icon/ic_plus_btn.svg';
import arrowDown from '@/public/icon/icon_arrow_down.svg';
import {useEffect} from 'react';

export default function TimeList() {
  const {
    control,
    formState: {errors},
    setError,
    clearErrors,
    watch,
  } = useFormContext();

  const {fields, append, remove} = useFieldArray({
    control,
    name: 'schedules',
  });

  const handleAddRow = () => {
    append({date: '', startTime: '', endTime: ''});
  };

  const handleMinusRow = (index: number) => {
    remove(index);
  };

  const watchedField = watch('schedules');

  const handleChange = (field: any, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index: number) => {
    const newValue = e.target.value;

    if (newValue === '') {
      return;
    }

    field.onChange(newValue);

    const invalidSchedules = findOverlappingSchedules(watchedField);

    if (invalidSchedules.length === 0) {
      clearErrors('schedules');
    } else {
      invalidSchedules.forEach(i => {
        if (i === index) {
          setInvalidDateError(i, setError);
        } else {
          clearErrors(`schedules.${i}.date`);
        }
      });
    }
  };

  const setInvalidDateError = (index: number, setError: any) => {
    setError(`schedules.${index}.date`, {
      type: 'manual',
      message: '동일한 시간대가 중복됩니다.',
    });
  };

  return (
    <div className="mb-4">
      <label className="mb-3 block text-xl font-bold tablet:text-2xl">예약 가능한 시간대</label>
      {fields.map((row, index) => (
        <div key={index} className="mb-4">
          <div className="grid grid-cols-[1fr,auto,auto,auto] gap-1 pc:grid-cols-[1fr,auto,auto,auto] pc:gap-4">
            <div>
              {index === 0 && <label className="text-xl font-medium text-gray-800">날짜</label>}
              <Controller
                name={`schedules.${index}.date` as const}
                control={control}
                rules={{
                  required: '필수 값 입니다.',
                }}
                render={({field}) => (
                  <Input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    required={true}
                    value={field.value}
                    onChange={e => {
                      handleChange(field, e, index);
                    }}
                    className="w-full"
                  />
                )}
              />
            </div>

            <div>
              {index === 0 && <label className="text-xl font-medium text-gray-800">시작 시간</label>}
              <Controller
                name={`schedules.${index}.startTime` as const}
                control={control}
                defaultValue="0:00"
                render={({field}) => (
                  <SelectBox
                    value={field.value}
                    onChange={e => handleChange(field, e, index)}
                    options={generateTimeOptions()}
                    selectButtonImage={arrowDown}
                    label="00:00"
                    className="w-full max-w-79pxr bg-white tablet:max-w-none"
                  />
                )}
              />
            </div>
            <div>
              {index === 0 && <label className="text-xl font-medium text-gray-800">종료 시간</label>}
              <Controller
                name={`schedules.${index}.endTime` as const}
                control={control}
                defaultValue="0:00"
                render={({field}) => (
                  <SelectBox
                    value={field.value}
                    onChange={e => handleChange(field, e, index)}
                    options={generateTimeOptions()}
                    className="w-full max-w-79pxr bg-white tablet:max-w-none"
                    selectButtonImage={arrowDown}
                    label="00:00"
                  />
                )}
              />
            </div>
            {index === 0 ? (
              <>
                <div className="relative mt-26pxr h-16 w-16 cursor-pointer" onClick={handleAddRow}>
                  <Image src={plusBtn} alt="Add row" fill className="absolute" />
                </div>
              </>
            ) : (
              <div className="relative h-16 w-16 cursor-pointer" onClick={() => handleMinusRow(index)}>
                <Image src={minusBtn} alt="Remove row" fill />
              </div>
            )}
          </div>
          {(errors?.schedules as any)?.[index]?.date?.message && (
            <span className="text-sm text-red-500">{(errors.schedules as any)[index].date.message}</span>
          )}
          {index === 0 && fields.length > 1 && <hr className="mt-4"></hr>}
        </div>
      ))}
    </div>
  );
}
