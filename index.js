import { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } from 'discord.js';
import dotenv from 'dotenv';
import fs from 'fs';
import axios from 'axios';

dotenv.config();

const VIP_CROSS_SERVER_ROLES = [
    { guildId: '1530282755567521882', roleId: '1530309771704668262' },
    { guildId: '1529633636415180971', roleId: '1529873731835531396' }
];

const KLIP_KANAL_ID = 'BURAYA_KLIP_KANAL_ID_YAZILACAK';

const MARKET_URUNLERI = {
    '1': { id: '1', ad: 'VIP Üye Statüsü', fiyat: 100000, tip: 'sureli', sure: 7 * 24 * 60 * 60 * 1000, aciklama: '7 Günlük VIP Rolü ve Ayrıcalığı' },
    '2': { id: '2', ad: 'x2 Günlük Bonus Bileti', fiyat: 2500, tip: 'stoklu', aciklama: 'Sonraki !gunluk ödülünü x2 yapar' },
    '3': { id: '3', ad: 'Bahis Sigortası', fiyat: 1500, tip: 'stoklu', aciklama: 'Oynayacağın bahislerde güvence sağlar' },
    '4': { id: '4', ad: 'MVP Profil Unvanı', fiyat: 3000, tip: 'sureli', sure: 7 * 24 * 60 * 60 * 1000, aciklama: '7 Günlük MVP Profil Unvanı' },
    '5': { id: '5', ad: 'Gizli Esport Kasası', fiyat: 1500, tip: 'stoklu', aciklama: '500-5000 RVC arası rastgele ödül (!kasaac)' },
    '6': { id: '6', ad: 'Piyango Bileti', fiyat: 1000, tip: 'stoklu', aciklama: 'Haftalık/günlük çekiliş katılım bileti' },
    '7': { id: '7', ad: 'Clutch Kralı Unvanı', fiyat: 2000, tip: 'sureli', sure: 7 * 24 * 60 * 60 * 1000, aciklama: '7 Günlük Clutch Kralı Unvanı' },
    '8': { id: '8', ad: 'Bahis Oranı Katlayıcı (x1.5)', fiyat: 2000, tip: 'stoklu', aciklama: 'Sonraki maç bahis kazancını %50 artırır' },
    '9': { id: '9', ad: 'Gelişmiş Bahis Sigortası', fiyat: 2500, tip: 'stoklu', aciklama: 'Kaybedilen bahsin %50sini iade eder' },
    '10': { id: '10', ad: 'Hızlı Günlük Dondurucu', fiyat: 1500, tip: 'stoklu', aciklama: 'Günlük bonus süresini sıfırlar' },
    '11': { id: '11', ad: 'Özel Profil Banner', fiyat: 2500, tip: 'stoklu', aciklama: 'Profil kartı arka planını özelleştirir (!profilarka)' },
    '12': { id: '12', ad: 'Yüksek Riskli VIP Bahis Kuponu', fiyat: 3000, tip: 'stoklu', aciklama: 'Standart bahis limitini (5000 RVC) aşmanı sağlar' },
    '13': { id: '13', ad: 'Komple İflas Sigortası', fiyat: 3500, tip: 'stoklu', aciklama: 'Kaybedilen bahislerde yatırılan tutarın tamamını iade eder' },
    '14': { id: '14', ad: 'Efsanevi Bıçak / Skin Kasası', fiyat: 3500, tip: 'stoklu', aciklama: '1000-15000 RVC veya efsanevi ödül şansı (!bicakac)' },
    '15': { id: '15', ad: 'Kanal RVC Yağmuru', fiyat: 2000, tip: 'stoklu', aciklama: 'Bulunduğun kanaldakilere rastgele RVC dağıtır (!yagmur)' },
    '16': { id: '16', ad: 'Solo Virtüözü Unvanı', fiyat: 2500, tip: 'sureli', sure: 7 * 24 * 60 * 60 * 1000, aciklama: '7 Günlük Solo Virtüözü Müzisyen Unvanı' },
    '17': { id: '17', ad: 'Ritim Üstadı Unvanı', fiyat: 2500, tip: 'sureli', sure: 7 * 24 * 60 * 60 * 1000, aciklama: '7 Günlük Ritim Üstadı Unvanı' },
    '18': { id: '18', ad: 'Ace Kralı Unvanı', fiyat: 3000, tip: 'sureli', sure: 7 * 24 * 60 * 60 * 1000, aciklama: '7 Günlük Ace Kralı Unvanı' },
    '19': { id: '19', ad: 'Operatör Canavarı Unvanı', fiyat: 3000, tip: 'sureli', sure: 7 * 24 * 60 * 60 * 1000, aciklama: '7 Günlük Operatör Canavarı Unvanı' },
    '20': { id: '20', ad: 'Headshot Makinesi Unvanı', fiyat: 3000, tip: 'sureli', sure: 7 * 24 * 60 * 60 * 1000, aciklama: '7 Günlük Headshot Makinesi Unvanı' },
    '21': { id: '21', ad: 'Spike Ustası Unvanı', fiyat: 2500, tip: 'sureli', sure: 7 * 24 * 60 * 60 * 1000, aciklama: '7 Günlük Spike Ustası Unvanı' },
    '22': { id: '22', ad: 'Taktik Dehası Unvanı', fiyat: 2500, tip: 'sureli', sure: 7 * 24 * 60 * 60 * 1000, aciklama: '7 Günlük Taktik Dehası Unvanı' },
    '23': { id: '23', ad: 'Flawless Efsanesi Unvanı', fiyat: 3500, tip: 'sureli', sure: 7 * 24 * 60 * 60 * 1000, aciklama: '7 Günlük Flawless Efsanesi Unvanı' },
    '24': { id: '24', ad: 'Solo Carry Unvanı', fiyat: 3000, tip: 'sureli', sure: 7 * 24 * 60 * 60 * 1000, aciklama: '7 Günlük Solo Carry Unvanı' },
    '25': { id: '25', ad: 'Espor Efsanesi Unvanı', fiyat: 4000, tip: 'sureli', sure: 7 * 24 * 60 * 60 * 1000, aciklama: '7 Günlük Espor Efsanesi Unvanı' }
};

const DB_FILE = './database.json';
const loadDB = () => {
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify({ maclar: [], kadrolar: {}, ekonomiler: {}, transferler: {}, scrimler: [], profilleri: {}, gunlukler: {}, cekilisler: {}, envanterler: {}, sepetler: {}, klipler: {}, turnuva: { aktif: false, asama: 'kayit', odul: 0, katilanlar: [], tur: 1, maclar: [] }, gorevler: {}, bahisligi: {} }, null, 2));
    }
    const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    if (!data.sepetler) data.sepetler = {};
    if (!data.envanterler) data.envanterler = {};
    if (!data.klipler) data.klipler = {};
    if (!data.gorevler) data.gorevler = {};
    if (!data.bahisligi) data.bahisligi = {};
    if (!data.scrimler) data.scrimler = [];
    if (!data.profilleri) data.profilleri = {};
    if (!data.turnuva) data.turnuva = { aktif: false, asama: 'kayit', odul: 0, katilanlar: [], tur: 1, maclar: [] };
    return data;
};
const saveDB = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates
    ]
});

client.once('ready', () => {
    loadDB();
    console.log(`[BAŞARILI] RaveBot (${client.user.tag}) aktif!`);
});

function getBakiye(db, userId) {
    if (!db.ekonomiler[userId]) db.ekonomiler[userId] = 1000;
    return db.ekonomiler[userId];
}

function getUrunFiyati(fiyat, isOwner) {
    return isOwner ? Math.floor(fiyat * 0.5) : fiyat;
}

function getBannerColor(tema) {
    if (!tema) return '#00FFFF';
    const t = tema.toLowerCase();
    if (tema.startsWith('#') && tema.length === 7) return tema;
    if (t.includes('mor') || t.includes('purple')) return '#8A2BE2';
    if (t.includes('mavi') || t.includes('blue')) return '#0099FF';
    if (t.includes('yeşil') || t.includes('green')) return '#00FF00';
    if (t.includes('kırmızı') || t.includes('red')) return '#FF0000';
    if (t.includes('sarı') || t.includes('yellow')) return '#FFD700';
    if (t.includes('pembe') || t.includes('pink')) return '#FF69B4';
    if (t.includes('turuncu') || t.includes('orange')) return '#FFA500';
    if (t.includes('beyaz') || t.includes('white')) return '#FFFFFF';
    return '#00FFFF';
}

function getThemeEmoji(tema) {
    if (!tema) return '🎨';
    const t = tema.toLowerCase();
    if (t.includes('mor') || t.includes('purple')) return '🟣';
    if (t.includes('mavi') || t.includes('blue')) return '🔵';
    if (t.includes('yeşil') || t.includes('green')) return '🟢';
    if (t.includes('kırmızı') || t.includes('red')) return '🔴';
    if (t.includes('sarı') || t.includes('yellow')) return '🟡';
    if (t.includes('pembe') || t.includes('pink')) return '🩷';
    if (t.includes('turuncu') || t.includes('orange')) return '🟠';
    if (t.includes('beyaz') || t.includes('white')) return '⚪';
    return '🎨';
}

client.on('messageCreate', async message => {
    if (message.author.bot || !message.guild) return;
    const db = loadDB();
    const bugunTarih = new Date().toISOString().split('T')[0];

    db.gorevler = db.gorevler || {};
    if (!db.gorevler[message.author.id] || db.gorevler[message.author.id].tarih !== bugunTarih) {
        db.gorevler[message.author.id] = { tarih: bugunTarih, gunluk: false, bahis: false, klip: false, alindi: false };
    }

    if (message.channel.id === KLIP_KANAL_ID) {
        if (message.attachments.size > 0 || message.content.includes('http')) {
            db.klipler = db.klipler || {};
            db.klipler[message.id] = { userId: message.author.id, votes: 0, voters: [] };
            
            db.gorevler[message.author.id].klip = true;
            saveDB(db);

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId(`klip_oy_${message.id}`).setLabel('👍 Oy Ver (0)').setStyle(ButtonStyle.Primary)
            );
            await message.react('🎬').catch(() => {});
            await message.reply({ components: [row] }).catch(() => {});
        }
    }

    const args = message.content.trim().split(/ +/);
    const command = args.shift().toLowerCase();
    const isOwner = message.author.id === message.guild.ownerId;

    if (command === '!komutlar' || command === '!yardım') {
        const embed = new EmbedBuilder()
            .setColor('#00FFFF')
            .setTitle('🤖 RaveBot - Gelişmiş Komut Rehberi')
            .setDescription('Sunucumuzda kullanabileceğin tüm sistem komutları ve ayrıntılı kullanım şekilleri:')
            .addFields(
                { name: '🎮 Espor & Maç & Turnuva', value: '• `!macolustur`\n• `!turnuvakur <Ödül>`\n• `!turnuvabaslat`\n• `!fikstür`', inline: false },
                { name: '⚔️ Scrim & Profil & Görevler', value: '• `!scrimara <Harita> <Saat>`\n• `!takimscrimara <Harita> <Saat>`\n• `!profilkur <RiotID#Tag> <AnaRol>` *(API Entegreli)*\n• `!profilarka <Tema/Renk>`\n• `!profil [@Kullanici]`\n• `!gorevler`\n• `!goreval`', inline: false },
                { name: '💰 Ekonomi & Bahis Ligi', value: '• `!cuzdan`\n• `!gunluk`\n• `!bahis <MacID> <1/2> <Miktar>`\n• `!liderlik`\n• `!bahisligi`', inline: false },
                { name: '🛒 Market, Sepet, Kasalar & Klip', value: '• `!market`\n• `!sepet`\n• `!envanter`\n• `!kasaac`\n• `!bicakac`\n• `!yagmur`\n• `!klipbitir`', inline: false },
                { name: '👑 Kurucu Paneli', value: '• `!kurucupaneli`', inline: false }
            )
            .setFooter({ text: 'RaveBot Espor Sistemleri • Riot Games API Aktif' });

        return message.channel.send({ embeds: [embed] });
    }

    if (command === '!profilkur') {
        const riotInput = args[0];
        const rol = args.slice(1).join(' ');

        if (!riotInput || !riotInput.includes('#') || !rol) {
            return message.reply('❌ Eksik veya hatalı kullanım! Örnek: `!profilkur Ka1Ro#TR1 Duelist`');
        }

        const [name, tag] = riotInput.split('#');
        await message.channel.send('⏳ Riot Games API üzerinden hesap verileri sorgulanıyor, lütfen bekleyin...').then(async msg => {
            try {
                const res = await axios.get(`https://api.henrikdev.xyz/valorant/v2/mmr/eu/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`);
                const data = res.data.data;

                const currentRank = data.current_tier_patched || 'Unranked';
                const mmrRating = data.ranking_in_tier || 0;

                db.profilleri = db.profilleri || {};
                const mevcutBanner = db.profilleri[message.author.id]?.banner || 'Standart Tema';
                
                db.profilleri[message.author.id] = { 
                    riotId: riotInput, 
                    rank: `${currentRank} (${mmrRating} RR)`, 
                    rol, 
                    banner: mevcutBanner 
                };
                saveDB(db);

                await msg.edit(`✅ Riot profili başarıyla senkronize edildi ve kaydedildi!\n👤 **Riot ID:** ${riotInput}\n🏆 **Canlı Rank:** ${currentRank} (${mmrRating} RR)\n🛡️ **Rol:** ${rol}`);
            } catch (e) {
                db.profilleri = db.profilleri || {};
                const mevcutBanner = db.profilleri[message.author.id]?.banner || 'Standart Tema';
                
                db.profilleri[message.author.id] = { riotId: riotInput, rank: 'Bilinmiyor (API Yanıt Vermedi)', rol, banner: mevcutBanner };
                saveDB(db);

                await msg.edit(`⚠️ Riot API'ye şu an ulaşılamadı ancak profiliniz kaydedildi!\n👤 **Riot ID:** ${riotInput}\n🛡️ **Rol:** ${rol}`);
            }
        });
        return;
    }

    // 🎲 Bahis Oynama Komutu
    if (command === '!bahis') {
        const macId = parseInt(args[0]);
        const tahmin = parseInt(args[1]);
        const miktar = parseInt(args[2]);

        if (isNaN(macId) || (tahmin !== 1 && tahmin !== 2) || isNaN(miktar) || miktar <= 0) {
            return message.reply('❌ Kullanım: `!bahis <MacID> <1 veya 2> <Miktar>`');
        }

        const mac = db.maclar.find(m => m.id === macId);
        if (!mac || mac.durum !== 'Aktif') {
            return message.reply('❌ Bu ID ile aktif oynanabilir bir maç bulunmuyor.');
        }

        const bakiye = getBakiye(db, message.author.id);
        const limit = 5000;
        const inv = db.envanterler[message.author.id] || [];
        const vipKuponVar = inv.some(item => item.id === '12');

        if (miktar > limit && !vipKuponVar && !isOwner) {
            return message.reply(`❌ Standart maksimum bahis limiti **${limit} RVC**'dir. Daha yüksek oynamak için marketten **Yüksek Riskli VIP Bahis Kuponu** almalısın!`);
        }

        if (bakiye < miktar) {
            return message.reply(`❌ Yeterli bakiyeniz yok! Cüzdanınızda **${bakiye} RVC** var.`);
        }

        db.ekonomiler[message.author.id] -= miktar;
        mac.bahisler[tahmin][message.author.id] = (mac.bahisler[tahmin][message.author.id] || 0) + miktar;

        db.gorevler[message.author.id].bahis = true;
        saveDB(db);

        const secilenTakim = tahmin === 1 ? mac.takim1 : mac.takim2;
        return message.reply(`✅ **${secilenTakim}** için başarıyla **${miktar} RVC** tutarında bahis yatırıldı! Bol şans 🎲`);
    }

    // 🎁 Kasa Açma Komutları
    if (command === '!kasaac' || command === '!bicakac') {
        db.envanterler = db.envanterler || {};
        const inv = db.envanterler[message.author.id] || [];
        const kasaId = command === '!kasaac' ? '5' : '14';
        const kasaIndex = inv.findIndex(item => item.id === kasaId);

        if (kasaIndex === -1 && !isOwner) {
            return message.reply(`❌ Envanterinizde bu kasa bulunmuyor! Marketten satın alabilirsiniz.`);
        }

        if (kasaIndex !== -1 && !isOwner) {
            if (inv[kasaIndex].miktar && inv[kasaIndex].miktar > 1) {
                inv[kasaIndex].miktar -= 1;
            } else {
                inv.splice(kasaIndex, 1);
            }
        }

        const minOdul = command === '!kasaac' ? 500 : 1000;
        const maxOdul = command === '!kasaac' ? 5000 : 15000;
        const kazanilanRvc = Math.floor(Math.random() * (maxOdul - minOdul + 1)) + minOdul;

        db.ekonomiler[message.author.id] = (db.ekonomiler[message.author.id] || 1000) + kazanilanRvc;
        saveDB(db);

        const kasaAdi = command === '!kasaac' ? 'Gizli Esport Kasası' : 'Efsanevi Bıçak / Skin Kasası';
        return message.reply(`🎁 **${kasaAdi}** açıldı!\n🎉 Kutudan çıkan ödül: **+${kazanilanRvc} RVC** cüzdanınıza eklendi! 🚀`);
    }

    // 🌧️ RVC Yağmuru Komutu
    if (command === '!yagmur') {
        db.envanterler = db.envanterler || {};
        const inv = db.envanterler[message.author.id] || [];
        const yagmurIndex = inv.findIndex(item => item.id === '15');

        if (yagmurIndex === -1 && !isOwner) {
            return message.reply('❌ Bu komutu kullanabilmek için marketten **Kanal RVC Yağmuru** ürünü satın almalısın!');
        }

        if (yagmurIndex !== -1 && !isOwner) {
            if (inv[yagmurIndex].miktar && inv[yagmurIndex].miktar > 1) {
                inv[yagmurIndex].miktar -= 1;
            } else {
                inv.splice(yagmurIndex, 1);
            }
        }

        saveDB(db);
        return message.channel.send(`🌧️ **RVC YAĞMURU BAŞLADI!** <@${message.author.id}> kanal üzerindeki kullanıcılara şans saçtı! 🎉`);
    }

    if (command === '!gorevler') {
        const g = db.gorevler[message.author.id];
        const g1 = g.gunluk ? '✅ Tamamlandı' : '❌ Yapılmadı';
        const g2 = g.bahis ? '✅ Tamamlandı' : '❌ Yapılmadı';
        const g3 = g.klip ? '✅ Tamamlandı' : '❌ Yapılmadı';
        const durumMetin = g.alindi ? '🎁 **Ödül Alındı!**' : (g.gunluk && g.bahis && g.klip ? '🎉 **Ödülleri Almaya Hazır! (`!goreval`)**' : '⏳ Devam Ediyor...');

        const embed = new EmbedBuilder()
            .setColor('#00FF99')
            .setTitle(`🎯 ${message.author.username} - Günlük Görev Paneli`)
            .setDescription(`Bugünkü görevlerini tamamla, **1000 RVC** ödülü kap!\n\nDurum: ${durumMetin}`)
            .addFields(
                { name: '1️⃣ Günlük Ödülünü Al', value: `\`!gunluk\` komutunu kullan. [${g1}]`, inline: false },
                { name: '2️⃣ Bahis Oyna', value: `Herhangi bir maça \`!bahis\` oyna. [${g2}]`, inline: false },
                { name: '3️⃣ Klip Paylaş', value: `Klip kanalına video/bağlantı at. [${g3}]`, inline: false }
            );

        return message.channel.send({ embeds: [embed] });
    }

    if (command === '!goreval') {
        const g = db.gorevler[message.author.id];
        if (g.alindi) {
            return message.reply('❌ Bugünün günlük ödülünü zaten aldın! Yarın tekrar bekleriz.');
        }
        if (!g.gunluk || !g.bahis || !g.klip) {
            return message.reply('❌ Henüz tüm görevleri tamamlamadın! Eksik görevlerini görmek için `!gorevler` yazabilirsin.');
        }

        g.alindi = true;
        const odulMiktari = 1000;
        db.ekonomiler[message.author.id] = (db.ekonomiler[message.author.id] || 1000) + odulMiktari;
        saveDB(db);

        return message.reply(`🎉 **Tebrikler!** Tüm günlük görevleri başarıyla tamamladın ve **+${odulMiktari} RVC** ödülünü cüzdanına ekledin! 🚀`);
    }

    if (command === '!bahisligi') {
        db.bahisligi = db.bahisligi || {};
        const siralama = Object.entries(db.bahisligi).sort((a, b) => b[1] - a[1]).slice(0, 10);

        const embed = new EmbedBuilder()
            .setColor('#FF9900')
            .setTitle('📊 Sezonluk Bahis & Tahmin Ligi (Bahis Krallığı)')
            .setDescription('Maç bahislerinden elde edilen toplam net kâra göre sıralanan en iyi tahminciler:');

        if (siralama.length === 0) {
            embed.addFields({ name: 'Lig Durumu', value: 'Henüz bahis kazananı veya kaybedeni bulunmuyor.' });
        } else {
            let liste = '';
            siralama.forEach(([userId, kar], idx) => {
                const renkEmoji = kar >= 0 ? '🟢' : '🔴';
                liste += `**${idx + 1}.** <@${userId}> — ${renkEmoji} **${kar} RVC Net Kâr**\n`;
            });
            embed.addFields({ name: '🏆 Bahis Liderlik Tablosu', value: liste });
        }

        return message.channel.send({ embeds: [embed] });
    }

    if (command === '!turnuvakur') {
        if (!isOwner && !message.member.permissions.has('ManageGuild')) return message.reply('❌ Yetkin yok.');
        const odul = parseInt(args[0]);
        if (isNaN(odul) || odul <= 0) return message.reply('❌ Geçerli bir ödül miktarı gir! Örnek: `!turnuvakur 10000`');

        db.turnuva = {
            aktif: true,
            asama: 'kayit',
            odul: odul,
            katilanlar: [],
            tur: 1,
            maclar: []
        };
        saveDB(db);

        const embed = new EmbedBuilder()
            .setColor('#FFD700')
            .setTitle('🏆 Bireysel Espor Turnuvası Kayıtları Başladı!')
            .setDescription(`Ödül Havuzu: **${odul} RVC**\nKatılmak için aşağıdaki **"Turnuvaya Katıl"** butonuna tıklayın!`)
            .addFields({ name: '👥 Katılımcılar', value: 'Henüz kimse katılmadı.' });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('turnuva_katil').setLabel('🎉 Turnuvaya Katıl').setStyle(ButtonStyle.Success)
        );

        return message.channel.send({ embeds: [embed], components: [row] });
    }

    if (command === '!turnuvabaslat') {
        if (!message.member) return message.reply('❌ Üye bilgisi alınamadı.');
        if (!isOwner && !message.member.permissions.has('ManageGuild')) return message.reply('❌ Yetkin yok.');
        db.turnuva = db.turnuva || {};
        if (!db.turnuva.aktif || db.turnuva.asama !== 'kayit') {
            return message.reply('❌ Aktif kayıt aşamasında bir turnuva yok.');
        }

        const katilanlar = db.turnuva.katilanlar;
        if (katilanlar.length < 2) {
            return message.reply('❌ Turnuvanın başlaması için en az 2 katılımcı olmalıdır!');
        }

        const karisik = katilanlar.sort(() => 0.5 - Math.random());
        let maclar = [];

        for (let i = 0; i < karisik.length; i += 2) {
            if (i + 1 < karisik.length) {
                maclar.push({ p1: karisik[i], p2: karisik[i+1], kazanan: null });
            } else {
                maclar.push({ p1: karisik[i], p2: null, kazanan: karisik[i] });
            }
        }

        db.turnuva.asama = 'devam';
        db.turnuva.maclar = maclar;
        saveDB(db);

        const embed = new EmbedBuilder()
            .setColor('#00FFFF')
            .setTitle('⚔️ Bireysel Turnuva 1. Tur Eşleşmeleri Başladı!')
            .setDescription('Maç kazananlarını belirlemek için yetkililer aşağıdaki butonları kullanabilir.');

        let fields = [];
        maclar.forEach((m, idx) => {
            if (m.p2 === null) {
                fields.push({ name: `Maç #${idx + 1}`, value: `<@${m.p1}> (Rakibi olmadığı için tur atladı 🚀)`, inline: false });
            } else {
                fields.push({ name: `Maç #${idx + 1}`, value: `<@${m.p1}> vs <@${m.p2}>`, inline: false });
            }
        });
        embed.addFields(fields);

        let actionRows = [];
        maclar.forEach((m, idx) => {
            if (m.p2 !== null) {
                actionRows.push(
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder().setCustomId(`turnuva_kazan_${idx}_1`).setLabel(`🏆 Kazan: Oyuncu 1`.substring(0, 80)).setStyle(ButtonStyle.Primary),
                        new ButtonBuilder().setCustomId(`turnuva_kazan_${idx}_2`).setLabel(`🏆 Kazan: Oyuncu 2`.substring(0, 80)).setStyle(ButtonStyle.Danger)
                    )
                );
            }
        });

        return message.channel.send({ embeds: [embed], components: actionRows.slice(0, 5) });
    }

    if (command === '!klipbitir') {
        if (!isOwner && !message.member.permissions.has('ManageGuild')) return message.reply('❌ Yetkin yok.');
        db.klipler = db.klipler || {};
        const kliplerArr = Object.entries(db.klipler);

        if (kliplerArr.length === 0) return message.reply('❌ Değerlendirilecek aktif klip bulunmuyor.');

        let enIyiKlip = null;
        let maxOy = -1;

        for (let [msgId, data] of kliplerArr) {
            if (data.votes > maxOy) {
                maxOy = data.votes;
                enIyiKlip = { msgId, ...data };
            }
        }

        if (!enIyiKlip || maxOy <= 0) {
            return message.reply('❌ Hiç oy alan klip yok.');
        }

        const odulMiktari = 5000;
        db.ekonomiler[enIyiKlip.userId] = (db.ekonomiler[enIyiKlip.userId] || 1000) + odulMiktari;
        db.klipler = {};
        saveDB(db);

        return message.channel.send(`🏆 **Haftanın En İyi Klip Yarışması Sonuçlandı!**\n🎉 Kazanan: <@${enIyiKlip.userId}> (**${maxOy} Oy**)!\n💰 Büyük Ödül: **+${odulMiktari} RVC** eklendi! 🚀`);
    }

    if (command === '!macolustur') {
        let hedefKanal = message.mentions.channels.first();
        let kelimeler = args;

        if (hedefKanal) {
            kelimeler = args.slice(1);
        } else {
            hedefKanal = message.channel;
        }

        const vsIndex = kelimeler.findIndex(k => k.toLowerCase() === 'vs');
        if (vsIndex === -1 || kelimeler.length < vsIndex + 4) {
            return message.reply('❌ Eksik veya hatalı kullanım! Örnek: `!macolustur Rave vs BBL Haven 21:00`');
        }

        const takim1Adi = kelimeler.slice(0, vsIndex).join(' ');
        const takim2Adi = kelimeler[vsIndex + 1];
        const harita = kelimeler[vsIndex + 2];
        const zaman = kelimeler.slice(vsIndex + 3).join(' ');

        const karsilasmaMetni = `${takim1Adi} vs ${takim2Adi}`;
        const mac = { 
            id: db.maclar.length + 1, 
            karsilasma: karsilasmaMetni, 
            takim1: takim1Adi,
            takim2: takim2Adi,
            harita: harita, 
            zaman: zaman, 
            skor: "Oynanıyor...", 
            durum: "Aktif",
            bahisler: { 1: {}, 2: {} } 
        };
        db.maclar.push(mac);
        saveDB(db);

        const embed = new EmbedBuilder()
            .setColor('#00FFFF')
            .setTitle(`🎮 Maç Başladı / Bahisler Açık! (Maç #${mac.id})`)
            .addFields(
                { name: '⚔️ Karşılaşma', value: karsilasmaMetni, inline: true },
                { name: '🗺️ Harita', value: harita, inline: true },
                { name: '⏰ Zaman', value: zaman, inline: true },
                { name: '🎲 Bahis Komutu:', value: `\`!bahis ${mac.id} 1 <miktar>\` (${takim1Adi})\n\`!bahis ${mac.id} 2 <miktar>\` (${takim2Adi})`, inline: false }
            );

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`mac_${mac.id}_kazanan_1`).setLabel(`🏆 ${takim1Adi} Kazandı`).setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId(`mac_${mac.id}_kazanan_2`).setLabel(`🏆 ${takim2Adi} Kazandı`).setStyle(ButtonStyle.Danger)
        );

        await hedefKanal.send({ embeds: [embed], components: [row] });
        if (hedefKanal.id !== message.channel.id) {
            return message.reply(`✅ Maç paneli başarıyla <#${hedefKanal.id}> kanalına gönderildi!`);
        }
        return;
    }

    if (command === '!fikstür') {
        if (db.maclar.length === 0) return message.reply('📌 Henüz oluşturulmuş bir maç yok.');
        const embed = new EmbedBuilder().setColor('#00FFFF').setTitle('📅 Güncel Maç Fikstürü');
        db.maclar.forEach(m => {
            embed.addFields({ name: `Maç #${m.id} - ${m.karsilasma}`, value: `🗺️ Harita: ${m.harita}\n⏰ Zaman: ${m.zaman}\n🏆 Durum: ${m.durum} (${m.skor})` });
        });
        return message.channel.send({ embeds: [embed] });
    }

    if (command === '!profilarka') {
        db.envanterler = db.envanterler || {};
        const inv = db.envanterler[message.author.id] || [];
        const bannerSahibi = isOwner || inv.some(item => item.id === '11');

        if (!bannerSahibi) {
            return message.reply('❌ Bu komutu kullanabilmek için marketten **Özel Profil Banner** satın almalısın!');
        }

        const tema = args.join(' ');
        if (!tema) {
            return message.reply('❌ Kullanım: `!profilarka <Banner Teması veya Renk>`');
        }

        db.profilleri = db.profilleri || {};
        if (!db.profilleri[message.author.id]) {
            return message.reply('❌ Önce `!profilkur` ile bir espor profili oluşturmalısın!');
        }

        db.profilleri[message.author.id].banner = tema;
        saveDB(db);

        return message.reply(`✅ Profil banner / arka plan teman başarıyla **"${tema}"** olarak güncellendi!`);
    }

    if (command === '!profil') {
        const hedefUye = message.mentions.users.first() || message.author;
        db.profilleri = db.profilleri || {};
        db.envanterler = db.envanterler || {};
        
        const profil = db.profilleri[hedefUye.id];
        if (!profil) {
            return message.reply(`❌ ${hedefUye.username} kullanıcısına ait kayıtlı espor profili bulunamadı.`);
        }

        const hedefInv = db.envanterler[hedefUye.id] || [];
        const simdi = Date.now();

        let unvanListesi = [];
        if (hedefUye.id === message.guild.ownerId) unvanListesi.push('👑 Sunucu Kurucusu');
        const vipAktif = hedefInv.some(item => item.id === '1' && item.bitisTarihi > simdi);
        if (vipAktif) unvanListesi.push('👑 VIP Üye');

        hedefInv.forEach(item => {
            const urun = MARKET_URUNLERI[item.id];
            if (urun && urun.tip === 'sureli' && item.bitisTarihi > simdi && item.id !== '1') {
                unvanListesi.push(`✨ ${item.ad.replace('Unvanı', '').trim()}`);
            }
        });

        let unvan = unvanListesi.length > 0 ? unvanListesi.join(' | ') : 'Standart Oyuncu';

        const bannerTemasi = profil.banner || 'Standart Tema';
        const embedRengi = getBannerColor(bannerTemasi);
        const temaEmoji = getThemeEmoji(bannerTemasi);

        const embed = new EmbedBuilder()
            .setColor(embedRengi)
            .setTitle(`${temaEmoji} ${hedefUye.username} - Oyuncu Profili`)
            .addFields(
                { name: '🏷️ Riot ID', value: profil.riotId, inline: true },
                { name: '🏆 Güncel Rank', value: profil.rank, inline: true },
                { name: '🛡️ Ana Rol', value: profil.rol, inline: true },
                { name: '🎨 Banner / Tema', value: `${temaEmoji} ${bannerTemasi}`, inline: true },
                { name: '🎖️ Aktif Unvanlar / Rozetler', value: unvan, inline: false }
            );

        return message.channel.send({ embeds: [embed] });
    }

    if (command === '!scrimara') {
        const harita = args[0];
        const saat = args[1];
        if (!harita || !saat) return message.reply('❌ Kullanım: `!scrimara <Harita> <Saat>` (Örnek: `!scrimara Ascent 20:00`)');

        const scrimId = Date.now().toString();

        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('⚔️ YENİ SCRİM İLANI!')
            .setDescription(`**${message.author.username}** bireysel/takım scrim maçı arıyor!`)
            .addFields(
                { name: '🗺️ Harita', value: harita, inline: true },
                { name: '⏰ Saat', value: saat, inline: true },
                { name: '👤 Başlatan', value: `<@${message.author.id}>`, inline: true }
            )
            .setFooter({ text: `Scrim ID: ${scrimId}` });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`scrim_kabul_${scrimId}`).setLabel('🤝 Maçı Kabul Et / Rakip Ol').setStyle(ButtonStyle.Success)
        );

        return message.channel.send({ content: '@everyone Yeni scrim ilanı!', embeds: [embed], components: [row] });
    }

    if (command === '!takimscrimara') {
        const harita = args[0];
        const saat = args[1];
        if (!harita || !saat) return message.reply('❌ Kullanım: `!takimscrimara <Harita> <Saat>`');

        const scrimId = Date.now().toString();

        const embed = new EmbedBuilder()
            .setColor('#9400D3')
            .setTitle('🛡️ TAKİM SCRİM İLANI (ELIT)')
            .setDescription(`**${message.author.username}** ve ekibi resmi espor scrim maçı arıyor!`)
            .addFields(
                { name: '🗺️ Harita', value: harita, inline: true },
                { name: '⏰ Saat', value: saat, inline: true },
                { name: '👑 Takım Yetkilisi', value: `<@${message.author.id}>`, inline: true }
            )
            .setFooter({ text: `Takım Scrim ID: ${scrimId}` });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`scrim_kabul_${scrimId}`).setLabel('⚔️ Takım Scrimini Kabul Et').setStyle(ButtonStyle.Primary)
        );

        return message.channel.send({ content: '@everyone Resmi takım scrim ilanı yayınlandı!', embeds: [embed], components: [row] });
    }

    if (command === '!cuzdan' || command === '!bakiye') {
        const bakiye = getBakiye(db, message.author.id);
        saveDB(db);
        return message.reply(`💰 RaveCoin Cüzdanın: **${bakiye} RVC**`);
    }

    if (command === '!gunluk') {
        db.gunlukler = db.gunlukler || {};
        db.envanterler = db.envanterler || {};
        const simdi = Date.now();
        const sonAlim = db.gunlukler[message.author.id] || 0;
        const beklemeSuresi = 24 * 60 * 60 * 1000;

        const inv = db.envanterler[message.author.id] || [];
        const dondurucuIndex = inv.findIndex(item => item.id === '10');

        if (simdi - sonAlim < beklemeSuresi && !isOwner) {
            if (dondurucuIndex !== -1) {
                inv.splice(dondurucuIndex, 1);
                saveDB(db);
                message.channel.send(`🛡️ Hızlı Günlük Dondurucu kullanıldı ve ödülün verildi!`);
            } else {
                const kalanSureMs = beklemeSuresi - (simdi - sonAlim);
                const kalanSaat = Math.floor(kalanSureMs / (1000 * 60 * 60));
                const kalanDakika = Math.floor((kalanSureMs % (1000 * 60 * 60)) / (1000 * 60));
                return message.reply(`⏳ Günlük bonus için **${kalanSaat} saat ${kalanDakika} dakika** beklemelisin.`);
            }
        }

        const biletIndex = inv.findIndex(item => item.id === '2' && (!item.miktar || item.miktar > 0));
        let kazanilanBonus = 250;
        let biletMesaji = '';

        if (biletIndex !== -1 && !isOwner) {
            kazanilanBonus = 500;
            if (inv[biletIndex].miktar && inv[biletIndex].miktar > 1) {
                inv[biletIndex].miktar -= 1;
            } else {
                inv.splice(biletIndex, 1);
            }
            biletMesaji = ' *(x2 Günlük Bileti harcandı!)*';
        }

        db.gunlukler[message.author.id] = simdi;
        db.ekonomiler[message.author.id] = (db.ekonomiler[message.author.id] || 1000) + kazanilanBonus;
        
        db.gorevler[message.author.id].gunluk = true;
        saveDB(db);

        return message.reply(`🎁 Günlük bonus eklendi: **+${kazanilanBonus} RVC**!${biletMesaji}`);
    }

    if (command === '!market') {
        await message.delete().catch(() => {});
        try {
            const fetchedMessages = await message.channel.messages.fetch({ limit: 50 });
            const botMessages = fetchedMessages.filter(m => m.author.id === client.user.id);
            if (botMessages.size > 0) {
                await message.channel.bulkDelete(botMessages, true).catch(() => {});
            }
        } catch (e) {}

        const embed = new EmbedBuilder()
            .setColor('#FF9900')
            .setTitle('🛒 RaveBot - Yeni Nesil İnteraktif Mağaza')
            .setDescription('Sunucu içi ayrıcalıklar, unvanlar, kasalar ve şans biletleri.\nAşağıdaki menüden incelemek istediğiniz ürün kategorisini seçin veya hızlıca sepetinize ekleyin.');

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('market_kategori_sec')
            .setPlaceholder('🛍️ Ürün Kategorisi Seçin...')
            .addOptions([
                { label: 'VIP & Özel Üyelikler', description: 'VIP Statüsü ve Avantajlar', value: 'kat_vip', emoji: '👑' },
                { label: 'Unvan Koleksiyonu (1-10)', description: 'Profil unvanları ve özelleştirmeler', value: 'kat_unvan_1', emoji: '🎖️' },
                { label: 'Unvan Koleksiyonu (11-25)', description: 'Espor ve nişancı unvanları', value: 'kat_unvan_2', emoji: '🏆' },
                { label: 'Kasalar & Şans Ürünleri', description: 'Esport Kasası ve Bıçak Kasası', value: 'kat_kasalar', emoji: '🎁' }
            ]);

        const row = new ActionRowBuilder().addComponents(selectMenu);
        return message.channel.send({ embeds: [embed], components: [row] });
    }

    if (command === '!sepet') {
        db.sepetler = db.sepetler || {};
        const sepet = db.sepetler[message.author.id] || [];

        if (sepet.length === 0) {
            return message.reply('🛒 Sepetiniz boş! Marketten ürün eklemek için `!market` kullanabilirsiniz.');
        }

        let toplamFiyat = 0;
        let aciklama = '';
        sepet.forEach((item, idx) => {
            const urun = MARKET_URUNLERI[item.id];
            if (urun) {
                const fiyat = getUrunFiyati(urun.fiyat, isOwner);
                toplamFiyat += fiyat;
                aciklama += `**${idx + 1}.** ${urun.ad} — **${fiyat} RVC**\n`;
            }
        });

        const embed = new EmbedBuilder()
            .setColor('#0099FF')
            .setTitle(`🛍️ ${message.author.username} - Alışveriş Sepeti`)
            .setDescription(aciklama)
            .addFields({ name: '💳 Toplam Tutar', value: `**${toplamFiyat} RVC**` });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('sepet_onayla').setLabel('✅ Satın Alımı Tamamla').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('sepet_temizle').setLabel('🗑️ Sepeti Boşalt').setStyle(ButtonStyle.Danger)
        );

        return message.channel.send({ embeds: [embed], components: [row] });
    }

    if (command === '!envanter') {
        db.envanterler = db.envanterler || {};
        const inv = db.envanterler[message.author.id] || [];

        if (inv.length === 0) {
            return message.reply('🎒 Envanteriniz tamamen boş. Marketten ürün satın alarak envanterinizi doldurabilirsiniz!');
        }

        const embed = new EmbedBuilder()
            .setColor('#9900FF')
            .setTitle(`🎒 ${message.author.username} - Envanterim`);

        let liste = '';
        inv.forEach((item, idx) => {
            const urun = MARKET_URUNLERI[item.id];
            const miktarBilgi = item.miktar ? ` (Adet: ${item.miktar})` : '';
            const sureBilgi = item.bitisTarihi ? ` [Kalan: ${Math.max(0, Math.ceil((item.bitisTarihi - Date.now()) / (1000 * 60 * 60 * 24)))} gün]` : '';
            liste += `**${idx + 1}.** ${urun ? urun.ad : item.ad}${miktarBilgi}${sureBilgi}\n`;
        });

        embed.setDescription(liste);
        return message.channel.send({ embeds: [embed] });
    }
});

// 🎮 Etkileşim ve Buton Dinleyicileri (Interactions)
client.on('interactionCreate', async interaction => {
    if (!interaction.isRepliable()) return;
    const db = loadDB();
    const userId = interaction.user.id;
    const isOwner = userId === interaction.guild.ownerId;

    if (interaction.isStringSelectMenu() && interaction.customId === 'market_kategori_sec') {
        const secim = interaction.values[0];
        let filtreliUrunler = [];

        if (secim === 'kat_vip') {
            filtreliUrunler = Object.values(MARKET_URUNLERI).filter(u => u.id === '1' || (u.tip === 'sureli' && parseInt(u.id) <= 4));
        } else if (secim === 'kat_unvan_1') {
            filtreliUrunler = Object.values(MARKET_URUNLERI).filter(u => parseInt(u.id) >= 1 && parseInt(u.id) <= 10);
        } else if (secim === 'kat_unvan_2') {
            filtreliUrunler = Object.values(MARKET_URUNLERI).filter(u => parseInt(u.id) >= 11 && parseInt(u.id) <= 25);
        } else if (secim === 'kat_kasalar') {
            filtreliUrunler = Object.values(MARKET_URUNLERI).filter(u => u.aciklama.toLowerCase().includes('kasa') || u.aciklama.toLowerCase().includes('bilet'));
        }

        let desc = 'Seçilen kategorideki ürünler:\n\n';
        filtreliUrunler.forEach(u => {
            const fiyat = getUrunFiyati(u.fiyat, isOwner);
            desc += `**[ID: ${u.id}]** ${u.ad} — **${fiyat} RVC**\n*${u.aciklama}*\n\n`;
        });

        const embed = new EmbedBuilder().setColor('#FF9900').setTitle('🛍️ Market Ürünleri').setDescription(desc);
        return interaction.update({ embeds: [embed], components: [] });
    }

    if (interaction.isButton() && interaction.customId === 'turnuva_katil') {
        db.turnuva = db.turnuva || { aktif: false, katilanlar: [] };
        if (!db.turnuva.aktif) {
            return interaction.reply({ content: '❌ Aktif bir turnuva kayıt dönemi bulunmuyor.', ephemeral: true });
        }
        if (db.turnuva.katilanlar.includes(userId)) {
            return interaction.reply({ content: '⚠️ Bu turnuvaya zaten kayıt oldun!', ephemeral: true });
        }

        db.turnuva.katilanlar.push(userId);
        saveDB(db);
        return interaction.reply({ content: '✅ Başarıyla turnuvaya katıldın! Yerini aldın 🚀', ephemeral: true });
    }
});

client.login(process.env.TOKEN);