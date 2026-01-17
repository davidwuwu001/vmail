import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  getMailboxes, 
  createMailbox, 
  deleteMailbox, 
  getMailboxEmails,
  generateRandomMailboxName,
  type Mailbox,
  type Email,
} from '../services/mailboxApi';
import { removeToken } from '../services/authApi';

export function Dashboard() {
  const [mailboxes, setMailboxes] = useState<Mailbox[]>([]);
  const [selectedMailbox, setSelectedMailbox] = useState<Mailbox | null>(null);
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const navigate = useNavigate();

  // 加载邮箱列表
  useEffect(() => {
    loadMailboxes();
  }, []);

  // 加载选中邮箱的邮件
  useEffect(() => {
    if (selectedMailbox) {
      loadEmails(selectedMailbox.id);
    }
  }, [selectedMailbox]);

  const loadMailboxes = async () => {
    try {
      const data = await getMailboxes();
      setMailboxes(data);
      if (data.length > 0 && !selectedMailbox) {
        setSelectedMailbox(data[0]);
      }
    } catch (error: any) {
      toast.error(error.message);
      if (error.message.includes('未授权')) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const loadEmails = async (mailboxId: string) => {
    try {
      const data = await getMailboxEmails(mailboxId);
      setEmails(data);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleLogout = () => {
    removeToken();
    navigate('/auth');
  };

  const handleDeleteMailbox = async (mailboxId: string) => {
    if (!confirm('确定要删除这个邮箱吗？')) return;
    
    try {
      await deleteMailbox(mailboxId);
      toast.success('邮箱已删除');
      await loadMailboxes();
      if (selectedMailbox?.id === mailboxId) {
        setSelectedMailbox(mailboxes[0] || null);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">临时邮箱管理</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
          >
            退出登录
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 左侧：邮箱列表 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">我的邮箱</h2>
                <button
                  onClick={() => setShowCreateDialog(true)}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  + 新建
                </button>
              </div>

              <div className="space-y-2">
                {mailboxes.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">
                    还没有邮箱，点击新建创建一个
                  </p>
                ) : (
                  mailboxes.map((mailbox) => (
                    <div
                      key={mailbox.id}
                      className={`p-3 rounded cursor-pointer ${
                        selectedMailbox?.id === mailbox.id
                          ? 'bg-blue-50 border-2 border-blue-500'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      onClick={() => setSelectedMailbox(mailbox)}
                    >
                      <div className="text-sm font-medium truncate">
                        {mailbox.address}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {mailbox.expiresAt ? '临时' : '永久'}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* 右侧：邮件列表 */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow p-6">
              {selectedMailbox ? (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-xl font-semibold">{selectedMailbox.address}</h2>
                      <p className="text-sm text-gray-500 mt-1">
                        {emails.length} 封邮件
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteMailbox(selectedMailbox.id)}
                      className="px-4 py-2 text-sm text-red-600 hover:text-red-700"
                    >
                      删除邮箱
                    </button>
                  </div>

                  {emails.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <p>还没有收到邮件</p>
                      <p className="text-sm mt-2">向 {selectedMailbox.address} 发送邮件试试</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {emails.map((email) => (
                        <div key={email.id} className="border rounded-lg p-4 hover:bg-gray-50">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium">{email.subject || '(无主题)'}</h3>
                            <span className="text-xs text-gray-500">
                              {new Date(email.date).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            来自: {email.from.name || email.from.address}
                          </p>
                          <p className="text-sm text-gray-700 line-clamp-2">
                            {email.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  请选择一个邮箱查看邮件
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 创建邮箱对话框 */}
      {showCreateDialog && (
        <CreateMailboxDialog
          onClose={() => setShowCreateDialog(false)}
          onSuccess={() => {
            setShowCreateDialog(false);
            loadMailboxes();
          }}
        />
      )}
    </div>
  );
}

// 创建邮箱对话框组件
function CreateMailboxDialog({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [localPart, setLocalPart] = useState('');
  const [expiryHours, setExpiryHours] = useState<number | null>(24);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!localPart) {
      toast.error('请输入邮箱名');
      return;
    }

    setLoading(true);
    try {
      await createMailbox({ localPart, expiryHours });
      toast.success('邮箱创建成功');
      onSuccess();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-semibold mb-4">创建新邮箱</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              邮箱名
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={localPart}
                onChange={(e) => setLocalPart(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="例如: myname"
              />
              <button
                onClick={() => setLocalPart(generateRandomMailboxName())}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                随机
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              有效期
            </label>
            <select
              value={expiryHours || ''}
              onChange={(e) => setExpiryHours(e.target.value ? Number(e.target.value) : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="1">1 小时</option>
              <option value="6">6 小时</option>
              <option value="12">12 小时</option>
              <option value="24">24 小时</option>
              <option value="168">7 天</option>
              <option value="">永久</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            disabled={loading}
          >
            取消
          </button>
          <button
            onClick={handleCreate}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? '创建中...' : '创建'}
          </button>
        </div>
      </div>
    </div>
  );
}
