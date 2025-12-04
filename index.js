const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const express = require('express');
require('dotenv').config();

const app = express();
const PORT = 3000;

// ==================== KONFIGURASI ====================
const config = {
  token: process.env.DISCORD_TOKEN,
  welcomeChannelId: process.env.WELCOME_CHANNEL_ID,
  goodbyeChannelId: process.env.GOODBYE_CHANNEL_ID,
  language: process.env.LANGUAGE || 'id',
  debugMode: process.env.DEBUG_MODE === 'true'
};

// Discord Client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
  ]
});

// ==================== TEMA ====================
const THEME = {
  colors: {
    primary: 0x5865F2,
    secondary: 0x2F3136,
    success: 0x57F287,
    danger: 0xED4245,
    warning: 0xFEE75C
  }
};

const messages = {
  en: {
    welcome: {
      title: '👋 New Member',
      description: (member) => `Welcome ${member} to the server!`,
      fields: {
        username: '📝 Username',
        registered: '📅 Account Created',
        position: '👥 Member',
        access: '📌 Get Started',
        accessValue: '• Verify at <#verify>\n• Read <#rules-guidelines>\n• Introduce yourself'
      },
      footer: 'Welcome aboard',
      testMessage: '✅ Welcome bot is active'
    },
    goodbye: {
      title: '👋 Member Left',
      description: (tag) => `**${tag}** has left the server`,
      fields: {
        username: '📝 Username',
        remaining: '👥 Total Members',
        duration: '⏱️ Time in Server'
      },
      footer: 'Goodbye',
      testMessage: '✅ Goodbye bot is active'
    }
  },
  id: {
    welcome: {
      title: '👋 Member Baru Bergabung',
      description: (member) => `Halo ${member}, selamat datang di server!`,
      fields: {
        username: '📝 Username',
        registered: '📅 Akun Dibuat',
        position: '👥 Member ke',
        access: '📌 Mulai dari sini',
        accessValue: '• Baca <#rules-guidelines>\n• Perkenalkan diri\n• Ikuti diskusi'
      },
      footer: 'Selamat bergabung',
      testMessage: '✅ Bot welcome aktif'
    },
    goodbye: {
      title: '👋 Member Keluar',
      description: (tag) => `**${tag}** telah meninggalkan server`,
      fields: {
        username: '📝 Username',
        remaining: '👥 Total Member',
        duration: '⏱️ Waktu di Server'
      },
      footer: 'Sampai jumpa',
      testMessage: '✅ Bot goodbye aktif'
    }
  }
};

const lang = messages[config.language];

// ==================== FUNGSI HELPER ====================
function debugLog(message) {
  if (config.debugMode) {
    console.log(`[DEBUG ${new Date().toLocaleTimeString('id-ID')}] ${message}`);
  }
}

function getAccountStatus(timestamp) {
  const days = Math.floor((Date.now() - timestamp) / (1000 * 60 * 60 * 24));
  if (days < 7) return '⚠️ Akun Baru';
  if (days < 30) return '✅ Verified';
  if (days < 365) return '✅ Verified';
  return '🌟 Veteran';
}

function calculateDuration(joinedTimestamp) {
  if (!joinedTimestamp) return 'Tidak diketahui';
  
  const duration = Date.now() - joinedTimestamp;
  const days = Math.floor(duration / (1000 * 60 * 60 * 24));
  
  if (days < 1) {
    const hours = Math.floor(duration / (1000 * 60 * 60));
    return hours === 0 ? 'Baru saja' : `${hours} jam`;
  }
  if (days < 30) return `${days} hari`;
  if (days < 365) return `${Math.floor(days / 30)} bulan`;
  return `${Math.floor(days / 365)} tahun`;
}

// ==================== EXPRESS SERVER (KEEP-ALIVE) ====================
app.get('/', (req, res) => {
  const status = {
    status: 'online',
    bot: client.user ? client.user.tag : 'Starting...',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  };
  
  res.json(status);
});

app.listen(PORT, () => {
  console.log(`🌐 Web server running on port ${PORT}`);
});

// ==================== BOT READY ====================
client.once('clientReady', () => {
  console.log('═'.repeat(60));
  console.log(`✅ Bot Online: ${client.user.tag}`);
  console.log(`🌐 Language: ${config.language.toUpperCase()}`);
  console.log(`🔍 Debug: ${config.debugMode ? 'ON' : 'OFF'}`);
  console.log(`🖥️  Servers: ${client.guilds.cache.size}`);
  console.log('═'.repeat(60));
  
  // Test welcome channel
  const welcomeChannel = client.channels.cache.get(config.welcomeChannelId);
  if (welcomeChannel) {
    console.log(`✅ Welcome Channel: #${welcomeChannel.name}`);
    welcomeChannel.send(lang.welcome.testMessage)
      .then(() => debugLog('Welcome test message sent'))
      .catch(err => console.error('❌ Error:', err.message));
  } else {
    console.error('❌ Welcome channel not found!');
    console.error(`   ID: ${config.welcomeChannelId}`);
  }

  // Test goodbye channel
  const goodbyeChannel = client.channels.cache.get(config.goodbyeChannelId);
  if (goodbyeChannel) {
    console.log(`✅ Goodbye Channel: #${goodbyeChannel.name}`);
    goodbyeChannel.send(lang.goodbye.testMessage)
      .then(() => debugLog('Goodbye test message sent'))
      .catch(err => console.error('❌ Error:', err.message));
  } else {
    console.error('❌ Goodbye channel not found!');
    console.error(`   ID: ${config.goodbyeChannelId}`);
  }

  // Set bot status
  client.user.setPresence({
    activities: [{ name: 'Member Join/Leave', type: 3 }],
    status: 'online'
  });
});

// ==================== MEMBER JOIN ====================
client.on('guildMemberAdd', async (member) => {
  debugLog(`New member: ${member.user.tag}`);
  
  const channel = member.guild.channels.cache.get(config.welcomeChannelId);
  if (!channel) {
    console.error('❌ Welcome channel not accessible');
    return;
  }

  try {
    const accountStatus = getAccountStatus(member.user.createdTimestamp);
    
    const welcomeEmbed = new EmbedBuilder()
      .setColor(THEME.colors.success)
      .setTitle(lang.welcome.title)
      .setDescription(lang.welcome.description(member))
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
      .addFields(
        { 
          name: lang.welcome.fields.username, 
          value: `**${member.user.tag}**`, 
          inline: true 
        },
        { 
          name: lang.welcome.fields.registered, 
          value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>\n${accountStatus}`, 
          inline: true 
        },
        { 
          name: lang.welcome.fields.position, 
          value: `**#${member.guild.memberCount}**`, 
          inline: true 
        },
        { 
          name: lang.welcome.fields.access, 
          value: lang.welcome.fields.accessValue, 
          inline: false 
        }
      )
      .setFooter({ 
        text: `${lang.welcome.footer} • ${member.guild.name}`,
        iconURL: member.guild.iconURL({ dynamic: true })
      })
      .setTimestamp();

    await channel.send({ 
      content: `${member}`,
      embeds: [welcomeEmbed] 
    });
    
    console.log(`✅ Welcome sent: ${member.user.tag}`);
    
  } catch (error) {
    console.error('❌ Error sending welcome:', error.message);
    debugLog(error.stack);
  }
});

// ==================== MEMBER LEAVE ====================
client.on('guildMemberRemove', async (member) => {
  debugLog(`Member left: ${member.user.tag}`);
  
  const channel = member.guild.channels.cache.get(config.goodbyeChannelId);
  if (!channel) {
    console.error('❌ Goodbye channel not accessible');
    return;
  }

  try {
    const duration = calculateDuration(member.joinedTimestamp);

    const goodbyeEmbed = new EmbedBuilder()
      .setColor(THEME.colors.danger)
      .setTitle(lang.goodbye.title)
      .setDescription(lang.goodbye.description(member.user.tag))
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
      .addFields(
        { 
          name: lang.goodbye.fields.username, 
          value: `**${member.user.tag}**`, 
          inline: true 
        },
        { 
          name: lang.goodbye.fields.remaining, 
          value: `**${member.guild.memberCount}**`, 
          inline: true 
        },
        { 
          name: lang.goodbye.fields.duration, 
          value: `**${duration}**`, 
          inline: true 
        }
      )
      .setFooter({ 
        text: `${lang.goodbye.footer} • ${member.guild.name}`,
        iconURL: member.guild.iconURL({ dynamic: true })
      })
      .setTimestamp();

    await channel.send({ embeds: [goodbyeEmbed] });
    
    console.log(`✅ Goodbye sent: ${member.user.tag}`);
    
  } catch (error) {
    console.error('❌ Error sending goodbye:', error.message);
    debugLog(error.stack);
  }
});

// ==================== ERROR HANDLING ====================
client.on('error', error => {
  console.error('❌ Client Error:', error);
});

client.on('warn', warning => {
  console.warn('⚠️  Warning:', warning);
});

process.on('unhandledRejection', error => {
  console.error('❌ Unhandled Rejection:', error);
});

process.on('uncaughtException', error => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// ==================== LOGIN ====================
if (!config.token) {
  console.error('❌ DISCORD_TOKEN not found in environment variables!');
  process.exit(1);
}

client.login(config.token).catch(err => {
  console.error('❌ Login failed:', err.message);
  process.exit(1);
});
