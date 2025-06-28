"use client";

import React from 'react';
import { useForm, SubmitHandler, RegisterOptions } from 'react-hook-form';
import Link from 'next/link';
import type { FormValues, InputProps  } from './types';
import { 
    UserIcon, 
    IdentificationIcon, 
    DevicePhoneMobileIcon,
    LinkIcon,
    MapPinIcon,
    EnvelopeIcon,
    GlobeAltIcon,
    ArrowUpOnSquareIcon,
    BuildingStorefrontIcon,
    UserGroupIcon
} from '@heroicons/react/24/outline';

const FormInput = ({ id, label, register, registerOptions, error, icon, ...rest }: InputProps & { type?: string, registerOptions?: RegisterOptions<FormValues, keyof FormValues> }) => (
    <div className={`w-full ${rest.className}`}>
        <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">
            {label} {registerOptions && registerOptions.required && <span className="text-amber-500">*</span>}
        </label>
        <div className="relative">
            {icon && <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">{icon}</span>}
            <input
                id={id}
                {...register(id, registerOptions)}
                {...rest}
                className={`block w-full bg-gray-900 border border-gray-700 text-white rounded-md p-3 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-300 ${icon ? 'pl-10' : ''} ${error ? 'border-red-500' : 'border-gray-700'}`}
            />
        </div>
        {error && <p className="mt-1 text-xs text-red-500">{error.message}</p>}
    </div>
);

const FormSelect = ({ id, label, register, registerOptions, error, children, className }: InputProps & { children: React.ReactNode, registerOptions?: RegisterOptions<FormValues, keyof FormValues> }) => (
     <div className={`w-full ${className}`}>
        <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">
            {label} {registerOptions && registerOptions.required && <span className="text-amber-500">*</span>}
        </label>
        <select
            id={id}
            {...register(id, registerOptions)}
            className={`block w-full bg-gray-900 border border-gray-700 text-white rounded-md p-3 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-300 ${error ? 'border-red-500' : 'border-gray-700'}`}
        >
            {children}
        </select>
        {error && <p className="mt-1 text-xs text-red-500">{error.message}</p>}
    </div>
);

const FormTextarea = ({ id, label, register, registerOptions, error, ...rest }: InputProps & { registerOptions?: RegisterOptions<FormValues, keyof FormValues> }) => (
    <div className="w-full">
        <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">
            {label} {registerOptions && registerOptions.required && <span className="text-amber-500">*</span>}
        </label>
        <textarea
            id={id}
            rows={5}
            {...register(id, registerOptions)}
            {...rest}
            className={`block w-full bg-gray-900 border border-gray-700 text-white rounded-md p-3 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-300 ${error ? 'border-red-500' : 'border-gray-700'}`}
        ></textarea>
        {error && <p className="mt-1 text-xs text-red-500">{error.message}</p>}
    </div>
);

// Componente para Upload de Arquivo
const FormFileInput = ({ id, label, register, error, ...rest }: InputProps) => (
    <div className="w-full">
        <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">
            {label}
        </label>
        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-600 px-6 py-10">
            <div className="text-center">
                <ArrowUpOnSquareIcon className="mx-auto h-12 w-12 text-gray-500" aria-hidden="true" />
                <div className="mt-4 flex text-sm leading-6 text-gray-400">
                    <label
                        htmlFor={id}
                        className="relative cursor-pointer rounded-md bg-gray-800 font-semibold text-amber-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-amber-600 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 hover:text-amber-400 p-1"
                    >
                        <span>Escolher arquivo</span>
                        <input id={id} {...register(id)} type="file" className="sr-only" {...rest} />
                    </label>
                    <p className="pl-1">ou arraste e solte</p>
                </div>
                <p className="text-xs leading-5 text-gray-500">PNG, JPG, GIF até 1MB</p>
            </div>
        </div>
        {error && <p className="mt-1 text-xs text-red-500">{error.message}</p>}
    </div>
);


// --- Componente Principal do Formulário ---
const RegistrationForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
      defaultValues: {
        country: "Brasil",
      }
    });

    const onSubmit: SubmitHandler<FormValues> = data => {
        console.log("Dados do Formulário:", data);
        //  chamada para a API
        alert("Cadastro enviado com sucesso! Verifique o console para ver os dados.");
    };

    const iconProps = { className: "h-5 w-5" };

    return (
        <div className="bg-[#0D1117] text-white py-12 px-4 sm:px-6 lg:px-8 w-full max-w-5xl mx-auto">
            <div className="max-w-5xl mx-auto">
                <form onSubmit={handleSubmit(onSubmit)} className="mt-12 space-y-10">
                    {/* Seção 1: Informações Principais */}
                    <fieldset className="border-t border-gray-700 pt-8">
                        <legend className="text-xl font-semibold text-amber-500 mb-6">Informações Principais</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                            <FormSelect id="category" label="Categoria" register={register} error={errors.category}>
                                <option value="">Selecione uma Categoria</option>
                                <option value="restaurante">Restaurante</option>
                                <option value="servicos">Serviços</option>
                                <option value="varejo">Varejo</option>
                            </FormSelect>
                            <FormInput id="accountEmail" label="Email Conta BDM" type="email" register={register} registerOptions={{ required: 'Email é obrigatório' }} error={errors.accountEmail} placeholder="seu.email@exemplo.com" icon={<EnvelopeIcon {...iconProps} />} />
                            <FormInput id="establishmentName" label="Nome do Estabelecimento" register={register} registerOptions={{ required: 'Nome do estabelecimento é obrigatório' }} error={errors.establishmentName} placeholder="Nome fantasia da sua empresa" icon={<BuildingStorefrontIcon {...iconProps} />} />
                            <FormInput id="companyCnpj" label="CNPJ Empresa" register={register} error={errors.companyCnpj} placeholder="00.000.000/0000-00" icon={<IdentificationIcon {...iconProps} />} />
                            <FormInput id="responsibleName" label="Nome do Responsável" register={register} registerOptions={{ required: 'Nome do responsável é obrigatório' }} error={errors.responsibleName} placeholder="Nome completo do responsável" icon={<UserIcon {...iconProps} />} />
                            <FormInput id="responsibleCpf" label="CPF do Responsável" register={register} registerOptions={{ required: 'CPF é obrigatório' }} error={errors.responsibleCpf} placeholder="000.000.000-00" icon={<IdentificationIcon {...iconProps} />} />
                        </div>
                    </fieldset>

                     {/* Seção 2: Contato e Links */}
                    <fieldset className="border-t border-gray-700 pt-8">
                        <legend className="text-xl font-semibold text-amber-500 mb-6">Contato e Links</legend>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-8">
                             <FormInput id="phoneFixed" label="Telefone Fixo" type="tel" register={register} error={errors.phoneFixed} placeholder="(00) 0000-0000" icon={<DevicePhoneMobileIcon {...iconProps} />} />
                            <FormInput id="phoneCalls" label="Telefone Chamadas" type="tel" register={register} registerOptions={{ required: 'Telefone para chamadas é obrigatório' }} error={errors.phoneCalls} placeholder="(00) 00000-0000" icon={<DevicePhoneMobileIcon {...iconProps} />} />
                             <FormInput id="phoneWhatsapp" label="Telefone Whatsapp" type="tel" register={register} error={errors.phoneWhatsapp} placeholder="(00) 00000-0000" icon={<DevicePhoneMobileIcon {...iconProps} />} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8 mt-8">
                             <FormInput id="websiteLink" label="Link do Site" type="url" register={register} error={errors.websiteLink} placeholder="https://seusite.com.br" icon={<GlobeAltIcon {...iconProps} />}/>
                             <FormInput id="instagramLink" label="Link do Instagram" type="url" register={register} error={errors.instagramLink} placeholder="https://instagram.com/seu_perfil" icon={<LinkIcon {...iconProps} />} />
                             <FormInput id="facebookLink" label="Link do Facebook" type="url" register={register} error={errors.facebookLink} placeholder="https://facebook.com/sua_pagina" icon={<LinkIcon {...iconProps} />} />
                             <FormInput id="mapLink" label="Link do Mapa (Google Maps)" type="url" register={register} error={errors.mapLink} placeholder="Link do Google Maps" icon={<MapPinIcon {...iconProps} />} />
                        </div>
                    </fieldset>

                    {/* Seção 3: Endereço */}
                    <fieldset className="border-t border-gray-700 pt-8">
                         <legend className="text-xl font-semibold text-amber-500 mb-6">Endereço</legend>
                         <div className="grid grid-cols-1 md:grid-cols-6 gap-x-6 gap-y-8">
                            <FormInput id="cep" label="CEP" register={register} registerOptions={{ required: 'CEP é obrigatório' }} error={errors.cep} placeholder="00000-000" className="md:col-span-2" icon={<MapPinIcon {...iconProps} />} />
                            <FormInput id="address" label="Logradouro" register={register} registerOptions={{ required: 'Logradouro é obrigatório' }} error={errors.address} placeholder="Rua, Avenida, etc." className="md:col-span-4" icon={<MapPinIcon {...iconProps} />} />
                            <FormInput id="number" label="Número" register={register} registerOptions={{ required: 'Número é obrigatório' }} error={errors.number} placeholder="123" className="md:col-span-1" />
                            <FormInput id="complement" label="Complemento" register={register} error={errors.complement} placeholder="Apto, Bloco, etc." className="md:col-span-2" />
                            <FormInput id="neighborhood" label="Bairro" register={register} registerOptions={{ required: 'Bairro é obrigatório' }} error={errors.neighborhood} placeholder="Centro" className="md:col-span-3" />
                            <FormSelect id="country" label="País" register={register} error={errors.country} className="md:col-span-2">
                               <option value="Brasil">Brasil</option>
                            </FormSelect>
                            <FormSelect id="state" label="Estado" register={register} registerOptions={{ required: 'Estado é obrigatório' }} error={errors.state} className="md:col-span-2">
                                <option value="">Selecione um Estado</option>
                                <option value="SP">São Paulo</option>
                                <option value="RJ">Rio de Janeiro</option>
                            </FormSelect>
                             <FormSelect id="city" label="Cidade" register={register} registerOptions={{ required: 'Cidade é obrigatória' }} error={errors.city} className="md:col-span-2">
                                <option value="">Selecione uma Cidade</option>
                                <option value="Sao Paulo">São Paulo</option>
                                <option value="Campinas">Campinas</option>
                            </FormSelect>
                         </div>
                    </fieldset>

                    {/* Seção 4: Detalhes do Estabelecimento */}
                    <fieldset className="border-t border-gray-700 pt-8">
                         <legend className="text-xl font-semibold text-amber-500 mb-6">Detalhes do Estabelecimento</legend>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                            <FormSelect id="establishmentType" label="Tipo de Estabelecimento" register={register} error={errors.establishmentType}>
                                <option value="">Selecione o Tipo</option>
                                <option value="fisico">Local Físico</option>
                                <option value="online">Online</option>
                                <option value="ambos">Ambos</option>
                            </FormSelect>
                            <FormSelect id="openingHours" label="Horário de Atendimento" register={register} error={errors.openingHours}>
                                <option value="">Selecione o Horário</option>
                                <option value="comercial">Horário Comercial</option>
                                <option value="24h">24 Horas</option>
                                <option value="personalizado">Personalizado</option>
                            </FormSelect>
                            <div className="md:col-span-2">
                               <FormTextarea id="companyDescription" label="Descrição da Empresa" register={register} registerOptions={{ required: 'Descrição é obrigatória' }} error={errors.companyDescription} placeholder="Fale sobre sua empresa, produtos e serviços." />
                            </div>
                            <div className="md:col-span-2">
                               <FormFileInput id="logo" label="Anexar LOGO" register={register} error={errors.logo} />
                            </div>
                         </div>
                    </fieldset>
                    
                     {/* Seção 5: Outras Informações */}
                    <fieldset className="border-t border-gray-700 pt-8">
                         <legend className="text-xl font-semibold text-amber-500 mb-6">Outras Informações</legend>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                            <FormSelect id="indicationSource" label="Origem Indicação" register={register} error={errors.indicationSource}>
                                <option value="">Selecione a Origem</option>
                                <option value="consultor">Consultor</option>
                                <option value="amigo">Amigo</option>
                                <option value="internet">Internet</option>
                            </FormSelect>
                            <FormInput id="indicator" label="Indicação/Consultor" register={register} error={errors.indicator} placeholder="Nome de quem indicou" icon={<UserGroupIcon {...iconProps} />}/>
                         </div>
                    </fieldset>

                    {/* Submissão e Privacidade */}
                    <div className="border-t border-gray-700 pt-8 space-y-6">
                        <div className="relative flex items-start">
                            <div className="flex h-6 items-center">
                                <input
                                    id="privacyPolicy"
                                    type="checkbox"
                                    {...register("privacyPolicy", { required: "Você deve aceitar a política de privacidade" })}
                                    className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-amber-500 focus:ring-amber-600"
                                />
                            </div>
                            <div className="ml-3 text-sm leading-6">
                                <label htmlFor="privacyPolicy" className="font-medium text-gray-300">
                                    Política de Privacidade <span className="text-amber-500">*</span>
                                </label>
                                <p className="text-gray-500">Sim, estou ciente do <Link href="/termos" className="text-amber-500 hover:underline">Termo de Uso</Link>.</p>
                            </div>
                        </div>
                         {errors.privacyPolicy && <p className="mt-1 text-sm text-red-500">{errors.privacyPolicy.message}</p>}

                        <div className="text-center">
                            <button
                                type="submit"
                                className="bg-amber-500 text-black font-bold py-3 px-16 rounded-md hover:bg-amber-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-amber-500"
                            >
                                Enviar Cadastro
                            </button>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default RegistrationForm;