import {useFieldArray, Controller, useFormContext, FieldError} from 'react-hook-form';
import Image from 'next/image';
import {Schedule} from '@/types/postActivities.types';
import Input from '@/components/common/Input';
import SelectBox from '@/components/common/selectbox';
import {findOverlappingSchedules, generateTimeOptions} from '@/utils/fotmatted-hour-time';
import minusBtn from '@/public/icon/ic_minus_btn.svg';
import plusBtn from '@/public/icon/ic_plus_btn.svg';
import arrowDown from '@/public/icon/icon_arrow_down.svg';

interface Field {
  name: string;
  onChange: (value: string) => void;
  value: string;
}

type ScheduleError = {
  date?: FieldError;
};

export default function TimeList({type}: {type: 'register' | 'modify'}) {
  const {
    control,
    formState: {errors},
    setError,
    clearErrors,
    watch,
    getValues,
    setValue,
  } = useFormContext();

  const {fields, append, remove} = useFieldArray({
    control,
    name: 'schedules',
  });

  const {
    fields: modifyFields,
    append: modifyAppend,
    remove: modifyRemove,
  } = useFieldArray({
    control,
    name: 'schedulesToAdd',
  });

  const handleAddRow = () => {
    if (type === 'register') {
      append({date: '', startTime: '00:00', endTime: '00:00'});
    } else {
      modifyAppend({date: '', startTime: '00:00', endTime: '00:00'});
    }
  };

  const handleMinusRow = (index: number, removeType: 'fields' | 'modifyFields') => {
    if (type === 'modify' && removeType === 'fields') {
      const values = getValues();
      const removedId = values.schedules[index].id;
      const prevIds = getValues('scheduleIdsToRemove') || [];
      setValue('scheduleIdsToRemove', [...prevIds, removedId], {shouldValidate: false});
    }

    if (removeType === 'fields') {
      remove(index);
    } else {
      modifyRemove(index);
    }
  };

  const watchedField = watch('schedules');

  const getIdsFromSchedules = (schedules: Schedule[]): number[] => {
    return schedules.map(schedule => schedule.id).filter((id): id is number => id !== undefined);
  };

  const handleChange = (field: Field, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index: number) => {
    const newValue = e.target.value;
    if (newValue === '') return;
    field.onChange(newValue);

    // 기존데이터 수정
    // :: 기존있는 데이터를 모두삭제후 재등록
    if (type === 'modify' && field.name.startsWith('schedules.')) {
      const schedules = getValues('schedules');
      const scheduleIdsToRemove = getValues('scheduleIdsToRemove');

      if (scheduleIdsToRemove === undefined) {
        setValue('scheduleIdsToRemove', getIdsFromSchedules(schedules));
      }
      setValue('schedulesToAddTemp', getValues('schedules'));
    }

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

  const handleInput = (field: Field, e: React.FormEvent<HTMLInputElement>) => {
    if ((e.target as HTMLInputElement).value === '') {
      field.onChange('');
    }
  };

  const setInvalidDateError = (index: number, setError: (name: string, error: {type: string; message: string}) => void) => {
    setError(`schedules.${index}.date`, {
      type: 'manual',
      message: '동일한 시간대가 중복됩니다.',
    });
  };

  const renderField = (
    label: string,
    name: string,
    types: 'date' | 'select',
    index: number,
    selectProps: {options?: {value: string; label: string}[]; label?: string} = {},
  ) => {
    return (
      <div>
        {name.startsWith('schedules.') && index === 0 && <label className="text-xl font-medium text-gray-800">{label}</label>}
        <Controller
          name={name}
          control={control}
          rules={{required: '필수 값 입니다.'}}
          render={({field}) => {
            if (types === 'date') {
              return (
                <Input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  required
                  value={field.value}
                  onChange={e => handleChange(field, e, index)}
                  onInput={(e: React.FormEvent<HTMLInputElement>) => handleInput(field, e)}
                  className="w-full"
                />
              );
            } else {
              return (
                <SelectBox
                  value={field.value}
                  onChange={e => handleChange(field, e, index)}
                  options={selectProps.options || generateTimeOptions()}
                  selectButtonImage={arrowDown}
                  className="w-full max-w-79pxr bg-white tablet:max-w-none"
                  label={selectProps.label || '00:00'}
                />
              );
            }
          }}
        />
      </div>
    );
  };

  return (
    <div className="mb-4">
      <label className="mb-3 block text-xl font-bold tablet:text-2xl">예약 가능한 시간대</label>
      {fields.map((row, index) => (
        <div key={row.id} className="mb-4">
          <div className="grid grid-cols-[1fr,auto,auto,auto] gap-1 pc:grid-cols-[1fr,auto,auto,auto] pc:gap-4">
            {renderField('날짜', `schedules.${index}.date`, 'date', index)}
            {renderField('시작 시간', `schedules.${index}.startTime`, 'select', index, {label: '00:00'})}
            {renderField('종료 시간', `schedules.${index}.endTime`, 'select', index, {label: '00:00'})}

            <div
              className={`relative h-16 w-16 cursor-pointer ${index === 0 ? 'mt-26pxr' : ''}`}
              onClick={() => (index === 0 ? handleAddRow() : handleMinusRow(index, 'fields'))}
            >
              <Image src={index === 0 ? plusBtn : minusBtn} alt={index === 0 ? 'Add row' : 'Remove row'} fill />
            </div>
          </div>
          {Array.isArray(errors.schedules) && errors.schedules[index]?.date?.message && (
            <span className="text-sm text-red-500">{(errors.schedules as ScheduleError[])[index]?.date?.message}</span>
          )}
          {index === 0 && <hr className="mt-4"></hr>}
        </div>
      ))}
      {/* 수정시 */}
      {type === 'modify' && modifyFields.length !== 0 && (
        <>
          {modifyFields.map((row, index) => (
            <div key={row.id} className="mb-4">
              <div className="grid grid-cols-[1fr,auto,auto,auto] gap-1 pc:grid-cols-[1fr,auto,auto,auto] pc:gap-4">
                {renderField('날짜', `schedulesToAdd.${index}.date`, 'date', index)}
                {renderField('시작 시간', `schedulesToAdd.${index}.startTime`, 'select', index, {label: '00:00'})}
                {renderField('종료 시간', `schedulesToAdd.${index}.endTime`, 'select', index, {label: '00:00'})}
                <div className="relative h-16 w-16 cursor-pointer" onClick={() => handleMinusRow(index, 'modifyFields')}>
                  <Image src={minusBtn} alt="Remove row" fill />
                </div>
              </div>
              {Array.isArray(errors.schedulesToAdd) && errors.schedulesToAdd[index]?.date?.message && (
                <span className="text-sm text-red-500">{(errors.schedulesToAdd as ScheduleError[])[index]?.date?.message}</span>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
