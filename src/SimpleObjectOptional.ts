import { TypeofToTemplate } from 'src';
import AbstractValidator from './AbstractValidator';
import { Options } from './types';
import { handleResult, unknownMatchesTemplate } from './unknownMatchesTemplate';

class SimpleObjectOptionalInnerClass<Type> extends AbstractValidator<
  TypeofToTemplate<Type>
> {
  get label() {
    return 'object | undefined | null';
  }

  constructor(template: TypeofToTemplate<Type>) {
    super(template);
  }

  validate(unknownValue: unknown, options: Options, currentPath: string) {
    if (unknownValue === undefined || unknownValue === null) {
      return true;
    }

    const result =
      typeof unknownValue === 'object' &&
      unknownValue !== null &&
      !Array.isArray(unknownValue) &&
      Object.entries(this.parameter).every(([key, value]) =>
        unknownMatchesTemplate<Type>(
          (unknownValue as Record<string, unknown>)[key],
          value,
          options,
          currentPath
        )
      );

    return handleResult(result, unknownValue, this.label, options, currentPath);
  }
}

export const SimpleObjectOptionalFunction = <ReturnType>(
  params: TypeofToTemplate<ReturnType>
): SimpleObjectOptionalInnerClass<ReturnType> => {
  return new SimpleObjectOptionalInnerClass(params);
};

export default SimpleObjectOptionalInnerClass;