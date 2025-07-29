import React from 'react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';

interface FormValues {
  epos: {
    food: string;
    drinks: string;
    away: string;
    others: string;
    vat: string;
    charge: string;
    card: string;
  };
  third_party: {
    zomato: string;
    talabat: string;
    deliveroo: string;
    careem: string;
  };
  pdq: {
    amex: string;
    credit: string;
  };
  kpi: {
    hrs: string;
    sales: string;
    des: string;
  };
  summary: string;
}

const eposFields: { label: string; name: keyof FormValues['epos'] }[] = [
  { label: 'Food', name: 'food' },
  { label: 'Drinks', name: 'drinks' },
  { label: 'Take away', name: 'away' },
  { label: 'Others', name: 'others' },
  { label: 'VAT', name: 'vat' },
  { label: 'Service charges', name: 'charge' },
  { label: 'Credit card Tips', name: 'card' }
];

const thirdPartyFields: { label: string; name: keyof FormValues['third_party'] }[] = [
  { label: 'Zomato', name: 'zomato' },
  { label: 'Talabat', name: 'talabat' },
  { label: 'Deliveroo', name: 'deliveroo' },
  { label: 'Careem', name: 'careem' }
];

const pdqFields: { label: string; name: keyof FormValues['pdq'] }[] = [
  { label: 'AMEX', name: 'amex' },
  { label: 'Credit Card', name: 'credit' }
];

const kpiFields: { label: string; name: keyof FormValues['kpi'] }[] = [
  { label: 'Man Hours', name: 'hrs' },
  { label: 'Sales Per Man Hour', name: 'sales' },
  { label: 'Dessert Attachment', name: 'des' }
];

const EposForm = () => {
  const { register } = useFormContext<FormValues>();

  return (
    <Section title="EPOS Details">
      {eposFields.map((item, index) => (
        <InputField key={index} label={item.label} registerName={`epos.${item.name}`} />
      ))}
    </Section>
  );
};

const ThirdPartyForm = () => {
  const { register } = useFormContext<FormValues>();

  return (
    <Section title="Third Party Orders">
      {thirdPartyFields.map((item, index) => (
        <InputField key={index} label={item.label} registerName={`third_party.${item.name}`} />
      ))}
    </Section>
  );
};

const PdqForm = () => {
  const { register } = useFormContext<FormValues>();

  return (
    <Section title="PDQ Payments">
      {pdqFields.map((item, index) => (
        <InputField key={index} label={item.label} registerName={`pdq.${item.name}`} />
      ))}
    </Section>
  );
};

const KpiForm = () => {
  const { register } = useFormContext<FormValues>();

  return (
    <Section title="KPIs">
      {kpiFields.map((item, index) => (
        <InputField key={index} label={item.label} registerName={`kpi.${item.name}`} />
      ))}
    </Section>
  );
};

const SummaryForm = () => {
  const { register } = useFormContext<FormValues>();

  return (
    <Section title="Summary">
      <textarea
        {...register('summary')}
        rows={4}
        className="w-full p-2 border rounded"
        placeholder="Enter shift summary..."
      />
    </Section>
  );
};

const InputField = ({ label, registerName }: { label: string; registerName: any }) => {
  const { register } = useFormContext();
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        {...register(registerName)}
        type="text"
        className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
      />
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
  </div>
);

const ShiftSummaryForm = () => {
  const methods = useForm<FormValues>({
    defaultValues: {
      epos: { food: '', drinks: '', away: '', others: '', vat: '', charge: '', card: '' },
      third_party: { zomato: '', talabat: '', deliveroo: '', careem: '' },
      pdq: { amex: '', credit: '' },
      kpi: { hrs: '', sales: '', des: '' },
      summary: ''
    }
  });

  const onSubmit = (data: FormValues) => {
    console.log('Submitted data:', data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="max-w-4xl mx-auto">
        <EposForm />
        <ThirdPartyForm />
        <PdqForm />
        <KpiForm />
        <SummaryForm />
        <div className="text-right">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default ShiftSummaryForm;
