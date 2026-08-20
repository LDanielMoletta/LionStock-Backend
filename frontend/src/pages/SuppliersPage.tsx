import { useEffect, useState, ChangeEvent } from 'react';
import { Briefcase, Pencil, Trash2, Plus } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import StateView from '../components/common/StateView';
import Modal from '../components/ui/Modal';
import { extractListData } from '../services/api';
import { supplierService, Supplier, CreateSupplierPayload, UpdateSupplierPayload } from '../services/supplierService';

const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState<'create' | 'edit' | 'delete' | null>(null);
  const [form, setForm] = useState<CreateSupplierPayload & { _id?: string }>({ name: '', contactName: '', email: '', phone: '', address: '' });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const load = async () => {
    try {
      const res = await supplierService.getAll();
      setSuppliers(extractListData(res, []));
    } catch (err) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Erro ao carregar fornecedores.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm({ name: '', contactName: '', email: '', phone: '', address: '' }); setModal('create'); setFormError(''); };
  const openEdit = (s: Supplier) => { setForm({ _id: s._id, name: s.name || '', contactName: s.contactName || '', email: s.email || '', phone: s.phone || '', address: s.address || '' }); setModal('edit'); setFormError(''); };
  const openDelete = (s: Supplier) => { setForm(s); setModal('delete'); };

  const handleSave = async () => {
    setSaving(true);
    setFormError('');
    try {
      if (modal === 'create') {
        const payload: CreateSupplierPayload = { name: form.name, contactName: form.contactName, email: form.email, phone: form.phone, address: form.address };
        await supplierService.create(payload);
      } else {
        const id = form._id;
        if (!id) { setFormError('ID não encontrado.'); setSaving(false); return; }
        const payload: UpdateSupplierPayload = { name: form.name, contactName: form.contactName, email: form.email, phone: form.phone, address: form.address };
        await supplierService.update(id, payload);
      }
      setModal(null);
      await load();
    } catch (err) {
      setFormError(
        (err as { response?: { data?: { message?: string; errors?: { message?: string }[] } } })?.response?.data?.message ||
        (err as { response?: { data?: { errors?: { message?: string }[] } } })?.response?.data?.errors?.[0]?.message ||
        'Erro ao salvar.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await supplierService.remove(form._id!);
      setModal(null);
      await load();
    } catch (err) {
      setFormError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Erro ao excluir.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader title="Fornecedores" description="Gerencie fornecedores e contatos." action={
        <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-2xl bg-lion-blue px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90">
          <Plus className="h-4 w-4" /> Novo Fornecedor
        </button>
      } />

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-soft">Carregando...</div>
      ) : error ? (
        <StateView title="Erro" description={error} icon={Briefcase} />
      ) : suppliers.length === 0 ? (
        <StateView title="Sem fornecedores" description="Nenhum fornecedor cadastrado." icon={Briefcase} />
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-soft">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-700">Nome</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Contato</th>
                <th className="px-4 py-3 font-semibold text-slate-700">E-mail</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Telefone</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {suppliers.map((s) => (
                <tr key={s._id}>
                  <td className="px-4 py-3 font-medium text-slate-900">{s.name}</td>
                  <td className="px-4 py-3 text-slate-600">{s.contactName || '-'}</td>
                  <td className="px-4 py-3 text-slate-600">{s.email || '-'}</td>
                  <td className="px-4 py-3 text-slate-600">{s.phone || '-'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(s)} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => openDelete(s)} className="rounded-xl p-2 text-red-400 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(modal === 'create' || modal === 'edit') ? (
        <Modal title={modal === 'create' ? 'Novo Fornecedor' : 'Editar Fornecedor'} onClose={() => setModal(null)}>
          <div className="space-y-3">
            <div><label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">Nome do Fornecedor</label><input placeholder="Ex: Tech Distribuidora" value={form.name} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm((p) => ({ ...p, name: e.target.value }))} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-lion-blue" /></div>
            <div><label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">Nome do Contato</label><input placeholder="Nome da pessoa de contato" value={form.contactName} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm((p) => ({ ...p, contactName: e.target.value }))} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-lion-blue" /></div>
            <div><label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">E-mail</label><input placeholder="contato@fornecedor.com" value={form.email} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm((p) => ({ ...p, email: e.target.value }))} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-lion-blue" /></div>
            <div><label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">Telefone</label><input placeholder="(11) 99999-9999" value={form.phone} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm((p) => ({ ...p, phone: e.target.value }))} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-lion-blue" /></div>
            <div><label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">Endereço</label><input placeholder="Rua, número, bairro, cidade" value={form.address} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm((p) => ({ ...p, address: e.target.value }))} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-lion-blue" /></div>
            {formError && <p className="text-sm text-red-500">{formError}</p>}
            <button onClick={handleSave} disabled={saving} className="w-full rounded-xl bg-lion-blue px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50">
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </Modal>
      ) : null}

      {modal === 'delete' ? (
        <Modal title="Excluir Fornecedor" onClose={() => setModal(null)}>
          <p className="text-sm text-slate-600">Tem certeza que deseja excluir <strong>{form.name}</strong>?</p>
          {formError && <p className="mt-2 text-sm text-red-500">{formError}</p>}
          <div className="mt-4 flex gap-3">
            <button onClick={() => setModal(null)} className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancelar</button>
            <button onClick={handleDelete} disabled={saving} className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50">
              {saving ? 'Excluindo...' : 'Excluir'}
            </button>
          </div>
        </Modal>
      ) : null}
    </div>
  );
};

export default SuppliersPage;