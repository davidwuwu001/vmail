import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
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
import { useConfig } from '../hooks/useConfig';
import { MailList } from '../components/MailList';
import { CopyButton } from '../components/CopyButton';

// 导入图标
import ShieldCheck from '../components/icons/ShieldCheck';
import Clock from '../components/icons/Clock';
import Info from '../components/icons/Info';
import Cloudflare from '../components/icons/Cloudflare';

export function Dashboard() {
  const navigate = useNavigate();
  const config = useConfig();
  const { t } = useTranslation();
  const [mailboxes, setMailboxes] = useState<Mailbox[]>([]);
  const [selectedMailbox, setSelectedMailbox] = useState<Mailbox | null>(null);
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newMailboxName, setNewMailboxName] = useState('');
  const [expiryHours, setExpiryHours] = useState(6);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);

  // 加载邮箱列表
  const loadMailboxes = async () => {
    try {
      const data = await getMailboxes();
      setMailboxes(data);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // 加载邮件列表
  const loadEmails = async (mailboxId: string) => {
    try {
      setLoading(true);
      const data = await getMailboxEmails(mailboxId);
      setEmails(data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMailboxes();
  }, []);

  useEffect(() => {
    if (selectedMailbox) {
      loadEmails(selectedMailbox.id);
      // 每20秒自动刷新
      const interval = setInterval(() => {
        loadEmails(selectedMailbox.id);
      }, 20000);
      return () => clearInterval(interval);
    }
  }, [selectedMailbox]);

  // 创建邮箱
  const handleCreateMailbox = async () => {
    if (!newMailboxName) {
      toast.error('请输入邮箱名');
      return;
    }

    try {
      setLoading(true);
      await createMailbox({
        localPart: newMailboxName,
        expiryHours: expiryHours > 0 ? expiryHours : null,
      });
      toast.success('邮箱创建成功');
      setShowCreateModal(false);
      setNewMailboxName('');
      loadMailboxes();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 删除邮箱
  const handleDeleteMailbox = async (mailboxId: string) => {
    if (!confirm('确定要删除这个邮箱吗？')) return;

    try {
      await deleteMailbox(mailboxId);
      toast.success('邮箱已删除');
      if (selectedMailbox?.id === mailboxId) {
        setSelectedMailbox(null);
        setEmails([]);
      }
      loadMailboxes();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // 退出登录
  const handleLogout = () => {
    removeToken();
    navigate('/auth');
  };

  // 生成随机邮箱名
  const generateRandom = () => {
    const name = generateRandomMailboxName();
    setNewMailboxName(name);
  };

  // 格式化过期时间
  const formatExpiry = (expiresAt: string | null) => {
    if (!expiresAt) return '永久';
    const date = new Date(expiresAt);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    if (diff < 0) return '已过期';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 24) {
      return `${Math.floor(hours / 24)} 天`;
    }
    return `${hours} 小时 ${minutes} 分钟`;
  };

  return (
    <div className="h-full flex flex-col gap-4 md:flex-row justify-center items-start mt-24 mx-6 md:mx-10">
      {/* 左侧信息面板 */}
      <div className="flex flex-col text-white items-start w-full md:w-[350px] mx-auto gap-2">
        {/* 顶部信息卡片 */}
        <div className="w-full mb-4 md:max-w-[350px] shrink-0 group group-hover:before:duration-500 group-hover:after:duration-500 after:duration-500 hover:border-cyan-600 hover:before:[box-shadow:_20px_20px_20px_30px_#a21caf] duration-500 before:duration-500 hover:duration-500 hover:after:-right-8 hover:before:right-12 hover:before:-bottom-8 hover:before:blur origin-left hover:decoration-2 relative bg-neutral-800 h-full border text-left p-4 rounded-lg overflow-hidden border-cyan-50/20 before:absolute before:w-12 before:h-12 before:content[''] before:right-1 before:top-1 before:z-10 before:bg-violet-500 before:rounded-full before:blur-lg after:absolute after:z-10 after:w-20 after:h-20 after:content[''] after:bg-rose-300 after:right-8 after:top-3 after:rounded-full after:blur-lg">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-gray-50 text-xl font-bold group-hover:text-cyan-500 duration-500">
              {t('Virtual Temporary Email')}
            </h1>
            <button
              onClick={handleLogout}
              className="text-xs px-3 py-1 bg-red-600/80 hover:bg-red-600 rounded-md transition-colors">
              退出
            </button>
          </div>
          <div className="flex flex-col gap-4 text-sm text-gray-200">
            <div className="flex items-center gap-1.5">
              <ShieldCheck /> {t('Privacy friendly')}
            </div>
            <div className="flex items-center gap-1.5">
              <Clock />
              自定义有效期
            </div>
            <div className="flex items-center gap-1.5">
              <Info />
              多邮箱管理
            </div>
            <div className="flex items-center gap-2">
              <Cloudflare />
              {t('100% Run on Cloudflare')}
            </div>
          </div>
        </div>

        {/* 邮箱列表卡片 */}
        <div className="w-full md:max-w-[350px]">
          <div className="mb-3 flex items-center justify-between">
            <div className="font-semibold text-sm">我的邮箱</div>
            <button
              onClick={() => {
                generateRandom();
                setShowCreateModal(true);
              }}
              className="px-3 py-1 text-xs bg-cyan-600 hover:opacity-90 rounded-md transition-opacity">
              + 新建
            </button>
          </div>

          {mailboxes.length === 0 ? (
            <div className="text-sm text-gray-400 text-center py-4 bg-white/5 rounded-md">
              还没有邮箱，点击新建创建一个
            </div>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {mailboxes.map((mailbox) => (
                <div
                  key={mailbox.id}
                  onClick={() => setSelectedMailbox(mailbox)}
                  className={`p-3 rounded-md cursor-pointer transition-all ${
                    selectedMailbox?.id === mailbox.id
                      ? 'bg-cyan-600 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-gray-300'
                  }`}>
                  <div className="text-sm font-medium truncate">{mailbox.address}</div>
                  <div className="text-xs mt-1 opacity-75">
                    {formatExpiry(mailbox.expiresAt)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 当前选中的邮箱信息 */}
        {selectedMailbox && (
          <div className="w-full md:max-w-[350px] mt-4">
            <div className="mb-3 font-semibold text-sm">{t('Email address')}</div>
            <div className="flex items-center text-zinc-100 bg-white/10 backdrop-blur-xl shadow-inner px-4 py-3 rounded-md w-full">
              <span className="truncate text-sm">{selectedMailbox.address}</span>
              <CopyButton text={selectedMailbox.address} className="p-1 rounded-md ml-auto" />
            </div>
            <button
              onClick={() => handleDeleteMailbox(selectedMailbox.id)}
              className="mt-2 py-2 rounded-md w-full bg-red-600/80 hover:bg-red-600 transition-colors text-sm">
              删除邮箱
            </button>
          </div>
        )}
      </div>

      {/* 右侧邮件列表 */}
      <div className="w-full flex-1 overflow-hidden">
        <MailList
          isAddressCreated={!!selectedMailbox}
          emails={emails}
          isLoading={loading}
          isFetching={false}
          onDelete={() => {}}
          isDeleting={false}
          onRefresh={() => selectedMailbox && loadEmails(selectedMailbox.id)}
          selectedIds={[]}
          setSelectedIds={() => {}}
          onSelectEmail={setSelectedEmail}
          showViewPasswordButton={false}
          onShowPassword={() => {}}
          selectedEmail={selectedEmail}
          onCloseDetail={() => setSelectedEmail(null)}
          onExpand={() => {}}
        />
      </div>

      {/* 创建邮箱模态框 */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-neutral-800 rounded-lg p-6 max-w-md w-full border border-cyan-50/20 shadow-2xl">
            <h3 className="text-xl font-semibold text-white mb-4">创建新邮箱</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  邮箱名
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMailboxName}
                    onChange={(e) => setNewMailboxName(e.target.value)}
                    placeholder="例如: myname"
                    className="flex-1 px-3 py-2 bg-white/10 border border-cyan-50/20 rounded-md text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                  <button
                    onClick={generateRandom}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-md transition-colors">
                    随机
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  有效期
                </label>
                <select
                  value={expiryHours}
                  onChange={(e) => setExpiryHours(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white/10 border border-cyan-50/20 rounded-md text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent">
                  <option value={1} className="bg-neutral-800">1 小时</option>
                  <option value={6} className="bg-neutral-800">6 小时</option>
                  <option value={12} className="bg-neutral-800">12 小时</option>
                  <option value={24} className="bg-neutral-800">24 小时</option>
                  <option value={168} className="bg-neutral-800">7 天</option>
                  <option value={0} className="bg-neutral-800">永久</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-md transition-colors">
                取消
              </button>
              <button
                onClick={handleCreateMailbox}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-cyan-600 hover:opacity-90 text-white rounded-md transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? '创建中...' : '创建'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
