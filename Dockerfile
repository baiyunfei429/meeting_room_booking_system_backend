# ==========================================
# 第一阶段：构建阶段 (Build Stage)
# ==========================================
FROM node:22-alpine AS build-stage

# 安装 pnpm（指定大版本，如 9，防止未来大版本不兼容）
RUN npm install -g pnpm@9

# 如果你有原生依赖（如 bcrypt），需要加上编译环境
# RUN apk add --no-cache python3 make g++

WORKDIR /app

# 复制 pnpm 的锁文件和 package.json
COPY package.json pnpm-lock.yaml ./

# 安装所有依赖（包含 devDependencies，用于编译）
RUN pnpm install --frozen-lockfile

# 复制源码并构建
COPY . .
RUN pnpm run build


# ==========================================
# 第二阶段：生产依赖阶段 (Prod-Deps Stage)
# ==========================================
FROM node:22-alpine AS prod-deps

RUN npm install -g pnpm@9

WORKDIR /app
COPY package.json pnpm-lock.yaml ./

# 只安装生产依赖
RUN pnpm install --prod --frozen-lockfile


# ==========================================
# 第三阶段：运行阶段 (Production Stage)
# ==========================================
FROM node:22-alpine AS production-stage

ENV NODE_ENV=production

WORKDIR /app

# 这里有个关键点：pnpm 安装的 node_modules 是软链接（symlink）结构。
# 为了让它在最终镜像里正常工作，我们需要把整个结构拷贝过去。
# 注意路径：之前的排错中，你的编译产物是散在 dist 目录里的，这里拷到 /app/dist。
COPY --from=build-stage /app/dist ./dist
COPY --from=build-stage /app/package.json ./
# 拷贝生产依赖
COPY --from=prod-deps /app/node_modules ./node_modules
# COPY book.json users.json ./

# 为了安全，使用非 root 用户
USER node

EXPOSE 3005

CMD ["node", "dist/main.js"]