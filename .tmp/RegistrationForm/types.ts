import type { UseFormRegister, RegisterOptions, FieldError } from 'react-hook-form';

export type FormValues = {
    category: string;
    accountEmail: string;
    establishmentName: string;
    companyCnpj: string;
    responsibleCpf: string;
    responsibleName: string;
    phoneFixed: string;
    phoneCalls: string;
    phoneWhatsapp: string;
    websiteLink: string;
    instagramLink: string;
    facebookLink: string;
    mapLink: string;
    logo: FileList;
    cep: string;
    address: string;
    number: string;
    complement: string;
    neighborhood: string;
    country: string;
    state: string;
    city: string;
    establishmentType: string;
    openingHours: string;
    companyDescription: string;
    indicationSource: string;
    indicator: string;
    privacyPolicy: boolean;
};

export type InputProps = {
    id: keyof FormValues;
    label: string;
    register: UseFormRegister<FormValues>; 
    validation?: RegisterOptions;           
    error?: FieldError;                    
    placeholder?: string;
    className?: string;
    icon?: React.ReactNode;
};
