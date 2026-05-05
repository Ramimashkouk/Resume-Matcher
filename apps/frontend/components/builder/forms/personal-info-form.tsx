'use client';

import React, { useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PersonalInfo } from '@/components/dashboard/resume-component';
import { useTranslations } from '@/lib/i18n';

const MAX_PHOTO_BYTES = 2 * 1024 * 1024; // 2 MB

interface PersonalInfoFormProps {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
}

export const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ data, onChange }) => {
  const { t } = useTranslations();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof PersonalInfo, value: string) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_PHOTO_BYTES) {
      alert(t('builder.personalInfoForm.photoTooLarge'));
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result;
      if (typeof result === 'string') {
        onChange({ ...data, photo: result });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    onChange({ ...data, photo: undefined });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-4 border border-black p-6 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
      <h3 className="font-serif text-xl font-bold border-b border-black pb-2 mb-4">
        {t('builder.personalInfo')}
      </h3>

      {/* Photo upload */}
      <div className="space-y-2 mb-2">
        <Label className="font-mono text-xs uppercase tracking-wider text-gray-500">
          {t('builder.personalInfoForm.photo')}
        </Label>
        <div className="flex items-center gap-4">
          {data.photo ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.photo}
                alt="Profile photo"
                className="w-16 h-16 rounded-full object-cover border border-black"
              />
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="font-mono text-xs uppercase tracking-wider border border-black px-3 py-1 hover:bg-black hover:text-white transition-colors"
              >
                {t('builder.personalInfoForm.removePhoto')}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="font-mono text-xs uppercase tracking-wider border border-black px-3 py-1 hover:bg-black hover:text-white transition-colors"
            >
              {t('builder.personalInfoForm.uploadPhoto')}
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handlePhotoChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label
            htmlFor="name"
            className="font-mono text-xs uppercase tracking-wider text-gray-500"
          >
            {t('resume.personalInfo.name')}
          </Label>
          <Input
            id="name"
            value={data.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder={t('builder.personalInfoForm.placeholders.name')}
            className="rounded-none border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-700 bg-transparent"
          />
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="title"
            className="font-mono text-xs uppercase tracking-wider text-gray-500"
          >
            {t('resume.personalInfo.title')}
          </Label>
          <Input
            id="title"
            value={data.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder={t('builder.personalInfoForm.placeholders.title')}
            className="rounded-none border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-700 bg-transparent"
          />
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="font-mono text-xs uppercase tracking-wider text-gray-500"
          >
            {t('resume.personalInfo.email')}
          </Label>
          <Input
            id="email"
            type="email"
            value={data.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder={t('builder.personalInfoForm.placeholders.email')}
            className="rounded-none border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-700 bg-transparent"
          />
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="phone"
            className="font-mono text-xs uppercase tracking-wider text-gray-500"
          >
            {t('resume.personalInfo.phone')}
          </Label>
          <Input
            id="phone"
            type="tel"
            value={data.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder={t('builder.personalInfoForm.placeholders.phone')}
            className="rounded-none border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-700 bg-transparent"
          />
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="location"
            className="font-mono text-xs uppercase tracking-wider text-gray-500"
          >
            {t('resume.personalInfo.location')}
          </Label>
          <Input
            id="location"
            value={data.location || ''}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder={t('builder.personalInfoForm.placeholders.location')}
            className="rounded-none border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-700 bg-transparent"
          />
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="website"
            className="font-mono text-xs uppercase tracking-wider text-gray-500"
          >
            {t('resume.personalInfo.website')}
          </Label>
          <Input
            id="website"
            value={data.website || ''}
            onChange={(e) => handleChange('website', e.target.value)}
            placeholder={t('builder.personalInfoForm.placeholders.website')}
            className="rounded-none border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-700 bg-transparent"
          />
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="linkedin"
            className="font-mono text-xs uppercase tracking-wider text-gray-500"
          >
            {t('resume.personalInfo.linkedin')}
          </Label>
          <Input
            id="linkedin"
            value={data.linkedin || ''}
            onChange={(e) => handleChange('linkedin', e.target.value)}
            placeholder={t('builder.personalInfoForm.placeholders.linkedin')}
            className="rounded-none border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-700 bg-transparent"
          />
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="github"
            className="font-mono text-xs uppercase tracking-wider text-gray-500"
          >
            {t('resume.personalInfo.github')}
          </Label>
          <Input
            id="github"
            value={data.github || ''}
            onChange={(e) => handleChange('github', e.target.value)}
            placeholder={t('builder.personalInfoForm.placeholders.github')}
            className="rounded-none border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-700 bg-transparent"
          />
        </div>
      </div>
    </div>
  );
};
