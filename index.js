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

// ==================== TEMA WARNA ====================
const colors = {
  primary: 0x5865F2,
  success: 0x57F287,
  danger: 0xED4245,
  warning: 0xFEE75C,
  info: 0x3498DB
};

// ==================== PESAN MULTI-BAHASA ====================
const messages = {
  en: {
    welcome: {
      title: '👋 Welcome to the Server!',
      description: (member) => `Hey ${member}, welcome aboard! We're glad to have you here.`,
      fields: {
        username: '📝 Username',
        accountCreated: '📅 Account Created',
        memberNumber: '👥 Member',
        getStarted: '📌 Get Started',
        getStartedValue: '• Read the rules channel\n• Introduce yourself\n• Have fun and enjoy!'
      },
      footer: 'Welcome to the community'
    },
    goodbye: {
      title: '👋 Member Left',
      description: (tag) => `**${tag}** has left the server. Goodbye!`,
      fields: {
        username: '📝 Username',
        membersLeft: '👥 Members Remaining',
        timeInServer: '⏱️ Time in Server'
      },
      footer: 'Goodbye'
    }
  },
  id: {
    welcome: {
      title: '👋 Selamat Datang di Server!',
      description: (member) => `Halo ${member}, selamat datang! Senang kamu bergabung dengan kami.`,
      fields: {
        username: '📝 Username',
        accountCreated: '📅 Akun Dibuat',
        memberNumber: '👥 Member ke',
        getStarted: '📌 Mulai dari Sini',
        getStartedValue: '• Baca channel rules\n• Perkenalkan diri\n• Nikmati dan bersenang-senang!'
      },
      footer: 'Selamat bergabung di komunitas'
    },
    goodbye: {
      title: '👋 Member Keluar',
      description: (tag) => `**${tag}** telah meninggalkan server. Sampai jumpa!`,
      fields: {
        username: '📝 Username',
        membersLeft: '👥 Member Tersisa',
        timeInServer: '⏱️ Waktu di Server'
      },
      footer: 'Sampai jumpa'
    }
  }
};

const lang = messages[config.language];

// ==================== FUNGSI HELPER ====================
function debugLog(message) {
  if (config.debugMode) {
    const timestamp = new Date().toLocaleTimeString('id-ID');
    console.log(`[DEBUG ${timestamp}] ${message}`);
  }
}

function getAccountAge(timestamp) {
  const days = Math.floor((Date.now() - timestamp) / (1000 * 60 * 60 * 24));
  
  if (days < 7) return { badge: '⚠️', status: 'New Account' };
  if (days < 30) return { badge: '✅', status: 'Active' };
  if (days < 365) return { badge: '⭐', status: 'Regular' };
  return { badge: '👑', status: 'Veteran' };
}

function calculateDuration(joinedTimestamp) {
  if (!joinedTimestamp) return 'Unknown';
  
  const duration = Date.now() - joinedTimestamp;
  const days = Math.floor(duration / (1000 * 60 * 60 * 24));
  
  if (days < 1) {
    const hours = Math.floor(duration / (1000 * 60 * 60));
    return hours === 0 ? 'Just now' : `${hours} hour${hours > 1 ? 's' : ''}`;
  }
  if (days < 30) return `${days} day${days > 1 ? 's' : ''}`;
  if (days < 365) {
    const months = Math.floor(days / 30);
    return `${months} month${months > 1 ? 's' : ''}`;
  }
  const years = Math.floor(days / 365);
  return `${years} year${years > 1 ? 's' : ''}`;
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
client.once('ready', () => {
  console.log('\n' + '═'.repeat(50));
  console.log(`✅ Bot Online: ${client.user.tag}`);
  console.log(`🌐 Language: ${config.language.toUpperCase()}`);
  console.log(`🔍 Debug Mode: ${config.debugMode ? 'ON' : 'OFF'}`);
  console.log(`🖥️  Connected Servers: ${client.guilds.cache.size}`);
  console.log('═'.repeat(50) + '\n');
  
  // Set bot presence
  client.user.setPresence({
    activities: [{ name: 'members joining', type: 3 }],
    status: 'online'
  });
  
  // Test channels
  const welcomeChannel = client.channels.cache.get(config.welcomeChannelId);
  const goodbyeChannel = client.channels.cache.get(config.goodbyeChannelId);
  
  if (welcomeChannel) {
    console.log(`✅ Welcome Channel: #${welcomeChannel.name}`);
  } else {
    console.error(`❌ Welcome channel not found! ID: ${config.welcomeChannelId}`);
  }
  
  if (goodbyeChannel) {
    console.log(`✅ Goodbye Channel: #${goodbyeChannel.name}`);
  } else {
    console.error(`❌ Goodbye channel not found! ID: ${config.goodbyeChannelId}`);
  }
});

// ==================== MEMBER JOIN EVENT ====================
client.on('guildMemberAdd', async (member) => {
  debugLog(`New member joined: ${member.user.tag}`);
  
  const channel = member.guild.channels.cache.get(config.welcomeChannelId);
  if (!channel) {
    console.error('❌ Welcome channel not accessible');
    return;
  }

  try {
    const accountAge = getAccountAge(member.user.createdTimestamp);
    const accountCreated = `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`;
    
    const welcomeEmbed = new EmbedBuilder()
      .setColor(colors.success)
      .setTitle(lang.welcome.title)
      .setDescription(lang.welcome.description(member))
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
      .addFields(
        { 
          name: lang.welcome.fields.username, 
          value: `\`${member.user.tag}\``, 
          inline: true 
        },
        { 
          name: lang.welcome.fields.accountCreated, 
          value: `${accountCreated}\n${accountAge.badge} ${accountAge.status}`, 
          inline: true 
        },
        { 
          name: lang.welcome.fields.memberNumber, 
          value: `**#${member.guild.memberCount}**`, 
          inline: true 
        },
        { 
          name: lang.welcome.fields.getStarted, 
          value: lang.welcome.fields.getStartedValue, 
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
    
    console.log(`✅ Welcome message sent for: ${member.user.tag}`);
    
  } catch (error) {
    console.error(`❌ Error sending welcome message: ${error.message}`);
    debugLog(error.stack);
  }
});

// ==================== MEMBER LEAVE EVENT ====================
client.on('guildMemberRemove', async (member) => {
  debugLog(`Member left: ${member.user.tag}`);
  
  const channel = member.guild.channels.cache.get(config.goodbyeChannelId);
  if (!channel) {
    console.error('❌ Goodbye channel not accessible');
    return;
  }

  try {
    const timeInServer = calculateDuration(member.joinedTimestamp);

    const goodbyeEmbed = new EmbedBuilder()
      .setColor(colors.danger)
      .setTitle(lang.goodbye.title)
      .setDescription(lang.goodbye.description(member.user.tag))
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
      .addFields(
        { 
          name: lang.goodbye.fields.username, 
          value: `\`${member.user.tag}\``, 
          inline: true 
        },
        { 
          name: lang.goodbye.fields.membersLeft, 
          value: `**${member.guild.memberCount}** members`, 
          inline: true 
        },
        { 
          name: lang.goodbye.fields.timeInServer, 
          value: `**${timeInServer}**`, 
          inline: true 
        }
      )
      .setFooter({ 
        text: `${lang.goodbye.footer} • ${member.guild.name}`,
        iconURL: member.guild.iconURL({ dynamic: true })
      })
      .setTimestamp();

    await channel.send({ embeds: [goodbyeEmbed] });
    
    console.log(`✅ Goodbye message sent for: ${member.user.tag}`);
    
  } catch (error) {
    console.error(`❌ Error sending goodbye message: ${error.message}`);
    debugLog(error.stack);
  }
});

// ==================== ERROR HANDLING ====================
client.on('error', error => {
  console.error('❌ Discord Client Error:', error);
});

client.on('warn', warning => {
  console.warn('⚠️  Discord Warning:', warning);
});

process.on('unhandledRejection', error => {
  console.error('❌ Unhandled Promise Rejection:', error);
});

process.on('uncaughtException', error => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// ==================== BOT LOGIN ====================
if (!config.token) {
  console.error('❌ DISCORD_TOKEN not found in environment variables!');
  process.exit(1);
}

client.login(config.token).catch(err => {
  console.error('❌ Failed to login:', err.message);
  process.exit(1);
});
