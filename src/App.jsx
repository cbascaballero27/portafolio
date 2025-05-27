/**
 * Componente principal de la aplicación
 * @component
 * @description Aplicación de portafolio personal con soporte para temas claro/oscuro y múltiples idiomas
 */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { Github, Linkedin, Mail, ExternalLink, ArrowRight, X, Sun, Moon, Globe } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/components/theme-provider";
import translations from "./locales/es.json";
import translationsEn from "./locales/en.json";

// Animaciones mejoradas
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" }
};

const scaleIn = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { duration: 0.3, ease: "easeOut" }
};

const hoverAnimation = {
  scale: 1.05,
  transition: { duration: 0.2 }
};

const buttonHover = {
  scale: 1.02,
  transition: { duration: 0.2 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

/**
 * Componente de Modal de Contacto
 * @param {Object} props - Propiedades del modal
 * @param {boolean} props.isOpen - Estado de apertura del modal
 * @param {Function} props.onClose - Función para cerrar el modal
 * @param {Object} props.translations - Traducciones para el modal
 */
const ContactModal = ({ isOpen, onClose, translations }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://formspree.io/f/your-form-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({ title: "¡Mensaje enviado!", description: "Gracias por contactarme. Te responderé pronto." });
        onClose();
      } else throw new Error('Error al enviar el mensaje');
    } catch (error) {
      toast({ title: "Error", description: "Hubo un problema al enviar el mensaje. Por favor, inténtalo de nuevo.", variant: "destructive" });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="bg-background p-8 rounded-xl shadow-2xl max-w-md w-full mx-4 border border-accent/20"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-light bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {translations.contactMe}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-accent/50">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { id: 'name', type: 'text', label: translations.nameLabel || "Nombre", placeholder: translations.namePlaceholder || "Tu nombre" },
            { id: 'email', type: 'email', label: translations.emailLabel || "Email", placeholder: translations.emailPlaceholder || "tu@email.com" },
            { id: 'message', type: 'textarea', label: translations.messageLabel || "Mensaje", placeholder: translations.messagePlaceholder || "¿En qué puedo ayudarte?" }
          ].map((field) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id} className="text-sm font-medium">{field.label}</Label>
              {field.type === 'textarea' ? (
                <Textarea
                  id={field.id}
                  name={field.id}
                  value={formData[field.id]}
                  onChange={(e) => setFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
                  required
                  placeholder={field.placeholder}
                  className="min-h-[120px] focus:ring-2 focus:ring-primary transition-all border-accent/20"
                />
              ) : (
                <Input
                  id={field.id}
                  name={field.id}
                  type={field.type}
                  value={formData[field.id]}
                  onChange={(e) => setFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
                  required
                  placeholder={field.placeholder}
                  className="focus:ring-2 focus:ring-primary transition-all border-accent/20"
                />
              )}
            </div>
          ))}
          
          <Button 
            type="submit" 
            className="w-full hover:scale-[1.02] transition-transform bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          >
            {translations.submitButton || "Enviar Mensaje"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default function App() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [language, setLanguage] = useState('es');
  const [isLanguageTransitioning, setIsLanguageTransitioning] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const t = language === 'es' ? translations : translationsEn;

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const toggleLanguage = () => {
    setIsLanguageTransitioning(true);
    const newLanguage = language === 'es' ? 'en' : 'es';
    
    // Agregar clase de transición
    document.body.classList.add('language-transition');
    
    // Cambiar el idioma después de un pequeño retraso
    setTimeout(() => {
      setLanguage(newLanguage);
      localStorage.setItem('language', newLanguage);
      
      // Remover la clase de transición después de que se complete
      setTimeout(() => {
        document.body.classList.remove('language-transition');
        setIsLanguageTransitioning(false);
      }, 300);
    }, 50);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContact = () => {
    setIsContactModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsContactModalOpen(false);
    setFormData({ name: '', email: '', message: '' });
  };

  const handleDownloadCV = () => {
    // Crear un enlace temporal
    const link = document.createElement('a');
    link.href = '/files/hoja_de_vida.pdf'; // Asegúrate de que el archivo esté en public/files/
    link.download = 'CV-Sebastian-Caballero.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "¡Descarga iniciada!",
      description: "Tu hoja de vida se está descargando.",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('https://formspree.io/f/your-form-id', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "¡Mensaje enviado!",
          description: "Gracias por contactarme. Te responderé pronto.",
        });
        handleCloseModal();
      } else {
        throw new Error('Error al enviar el mensaje');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al enviar el mensaje. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  const socialLinks = {
    github: "https://github.com/cbascaballero27",
    linkedin: "https://www.linkedin.com/in/sebastian-caballero-escobar-aa8403163/",
    email: "mailto:sebastiancaballero2000@gmail.com"
  };

  return (
    <div className={`min-h-screen bg-background ${isLanguageTransitioning ? 'opacity-50' : 'opacity-100'}`}>
      <Toaster />
      
      {/* Botones de tema y lenguaje */}
      <div className="fixed top-4 right-4 flex gap-2 z-50">
        <motion.div
          whileHover={buttonHover}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full theme-transition hover:bg-accent/20 hover:shadow-lg hover:shadow-primary/20"
          >
            {theme === 'dark' ? (
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Sun className="h-4 w-4" />
              </motion.div>
            ) : (
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Moon className="h-4 w-4" />
              </motion.div>
            )}
          </Button>
        </motion.div>
        <motion.div
          whileHover={buttonHover}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="outline"
            size="icon"
            onClick={toggleLanguage}
            className="rounded-full language-transition hover:bg-accent/20 hover:shadow-lg hover:shadow-primary/20"
          >
            <motion.div
              whileHover={{ rotate: 15 }}
              transition={{ duration: 0.2 }}
            >
              <Globe className="h-4 w-4" />
            </motion.div>
          </Button>
        </motion.div>
      </div>

      {/* Sección Hero - Presentación principal */}
      <header className="container mx-auto px-4 py-16 relative language-transition">
        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeIn}
          className="max-w-2xl mx-auto"
        >
          <motion.h1 
            className="text-4xl md:text-6xl font-extralight mb-4 text-center bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {t.hero.title}
          </motion.h1>
          <motion.p 
            className="text-lg text-muted-foreground mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {t.hero.subtitle}
          </motion.p>
          <motion.div 
            className="flex justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <motion.div
              whileHover={buttonHover}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={handleContact} 
                variant="outline" 
                size="lg" 
                className="group border-primary/20 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 px-6"
              >
                <span className="flex items-center gap-2">
                  {t.buttons.contact}
                  <motion.div
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </motion.div>
                </span>
              </Button>
            </motion.div>
            <motion.div
              whileHover={buttonHover}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={handleDownloadCV}
                variant="outline" 
                size="lg" 
                className="group border-primary/20 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 px-6"
              >
                <span className="flex items-center gap-2">
                  {t.buttons.download}
                  <motion.div
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </motion.div>
                </span>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </header>

      {/* Botones de redes sociales */}
      <motion.div 
        className="flex justify-center gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <motion.div
          whileHover={buttonHover}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full hover:bg-accent/50 transition-colors border border-accent/20 hover:shadow-lg hover:shadow-primary/20 w-10 h-10"
            onClick={() => window.open(socialLinks.github, '_blank')}
          >
            <motion.div
              whileHover={{ rotate: 15 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
            >
              <Github className="h-5 w-5" />
            </motion.div>
          </Button>
        </motion.div>
        <motion.div
          whileHover={buttonHover}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full hover:bg-accent/50 transition-colors border border-accent/20 hover:shadow-lg hover:shadow-primary/20 w-10 h-10"
            onClick={() => window.open(socialLinks.linkedin, '_blank')}
          >
            <motion.div
              whileHover={{ rotate: 15 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
            >
              <Linkedin className="h-5 w-5" />
            </motion.div>
          </Button>
        </motion.div>
        <motion.div
          whileHover={buttonHover}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full hover:bg-accent/50 transition-colors border border-accent/20 hover:shadow-lg hover:shadow-primary/20 w-10 h-10"
            onClick={() => window.open(socialLinks.email, '_blank')}
          >
            <motion.div
              whileHover={{ rotate: 15 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
            >
              <Mail className="h-5 w-5" />
            </motion.div>
          </Button>
        </motion.div>
      </motion.div>

      {/* Modal de Contacto */}
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={handleCloseModal} 
        translations={t.contact} 
      />

      {/* Sección About Me */}
      <section className="container mx-auto px-4 py-12 language-transition">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.h2 
            className="text-2xl font-extralight mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            {t.about.title}
          </motion.h2>
          <motion.p 
            className="text-muted-foreground leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {t.about.description}
          </motion.p>
        </motion.div>
      </section>

      {/* Sección de Proyectos */}
      <section className="container mx-auto px-4 py-12 language-transition">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.h2 
            className="text-2xl font-extralight mb-8 text-center bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            {t.projects.title}
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {projects.map((project, index) => (
              <motion.div 
                key={index} 
                variants={fadeIn}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="border-0 shadow-none hover:bg-accent/50 transition-colors border border-accent/20 rounded-xl">
                  {project.url && (
                    <div className="relative group">
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-48 object-cover rounded-t-xl"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button 
                          variant="outline" 
                          className="text-white border-white hover:bg-white/10"
                          onClick={() => window.open(project.url, '_blank')}
                        >
                          {t.buttons.viewProject}
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl font-light">{project.title}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, tagIndex) => (
                        <Badge 
                          key={tagIndex} 
                          variant="secondary" 
                          className="font-normal bg-accent/20 hover:bg-accent/30 transition-colors"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Sección de Habilidades */}
      <section className="container mx-auto px-4 py-12 language-transition">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="max-w-4xl mx-auto"
        >
          <motion.h2 
            className="text-2xl font-extralight mb-8 text-center bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            {t.skills.title}
          </motion.h2>
          <div className="grid md:grid-cols-4 gap-6">
            {skills.map((skill, index) => (
              <motion.div 
                key={index} 
                variants={fadeIn}
                whileHover={{ y: -5, scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="border-0 shadow-none hover:bg-accent/50 transition-colors text-center p-6 border border-accent/20 rounded-xl">
                  <img  
                    alt={`${skill.name} icon`} 
                    className="w-12 h-12 mx-auto mb-4 rounded-lg object-contain"
                    src={skill.image}
                  />
                  <h3 className="text-sm font-light">{skill.name}</h3>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Sección de Contacto */}
      <footer className="container mx-auto px-4 py-12 border-t border-accent/20">
        <div className="text-center max-w-xl mx-auto">
          <motion.h2 
            className="text-2xl font-extralight mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            {t.contact.title}
          </motion.h2>
          <motion.p 
            className="text-sm text-muted-foreground mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {t.contact.subtitle}
          </motion.p>
          <motion.div 
            className="flex justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <motion.div
              whileHover={buttonHover}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full hover:bg-accent/50 transition-colors border border-accent/20 hover:shadow-lg hover:shadow-primary/20 w-10 h-10"
                onClick={() => window.open(socialLinks.github, '_blank')}
              >
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-center"
                >
                  <Github className="h-5 w-5" />
                </motion.div>
              </Button>
            </motion.div>
            <motion.div
              whileHover={buttonHover}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full hover:bg-accent/50 transition-colors border border-accent/20 hover:shadow-lg hover:shadow-primary/20 w-10 h-10"
                onClick={() => window.open(socialLinks.linkedin, '_blank')}
              >
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-center"
                >
                  <Linkedin className="h-5 w-5" />
                </motion.div>
              </Button>
            </motion.div>
            <motion.div
              whileHover={buttonHover}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full hover:bg-accent/50 transition-colors border border-accent/20 hover:shadow-lg hover:shadow-primary/20 w-10 h-10"
                onClick={() => window.open(socialLinks.email, '_blank')}
              >
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-center"
                >
                  <Mail className="h-5 w-5" />
                </motion.div>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}

// Datos de proyectos
const projects = [
  {
    title: "E-commerce Platform",
    description: "Plataforma de comercio electrónico con carrito de compras y pagos integrados",
    tags: ["React", "Node.js", "Stripe"],
    url: "https://ejemplo-ecommerce.com",
    image: "https://via.placeholder.com/600x400"
  },
  {
    title: "Task Management App",
    description: "Aplicación de gestión de tareas con características colaborativas",
    tags: ["React", "Firebase", "Tailwind"],
    url: null,
    image: "https://via.placeholder.com/600x400"
  },
  {
    title: "Portfolio Website",
    description: "Sitio web de portafolio personal con animaciones suaves",
    tags: ["React", "Framer Motion", "Tailwind"],
    url: "https://ejemplo-portfolio.com",
    image: "https://via.placeholder.com/600x400"
  },
  {
    title: "Blog Platform",
    description: "Plataforma de blog con sistema de gestión de contenido",
    tags: ["React", "GraphQL", "MDX"],
    url: null,
    image: "https://via.placeholder.com/600x400"
  }
];

// Datos de habilidades con descripciones para las imágenes
const skills = [
  { 
    name: "React",
    description: "Modern React logo with atomic symbol design in blue",
    image: "https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/react/react.png"
  },
  { 
    name: "Angular",
    description: "Angular framework logo in red",
    image: "https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/angular/angular.png"
  },
  { 
    name: "TypeScript",
    description: "TypeScript programming language logo in blue",
    image: "https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/typescript/typescript.png"
  },
  { 
    name: "JavaScript",
    description: "JavaScript programming language logo in yellow",
    image: "https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/javascript/javascript.png"
  },
  { 
    name: "HTML5",
    description: "HTML5 logo and markup language",
    image: "https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/html/html.png"
  },
  { 
    name: "CSS3",
    description: "CSS3 styling language logo",
    image: "https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/css/css.png"
  },
  { 
    name: "Git",
    description: "Git version control system logo",
    image: "https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/git/git.png"
  },
  { 
    name: "Tailwind CSS",
    description: "Tailwind CSS utility-first framework logo",
    image: "https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/tailwind/tailwind.png"
  }
];
