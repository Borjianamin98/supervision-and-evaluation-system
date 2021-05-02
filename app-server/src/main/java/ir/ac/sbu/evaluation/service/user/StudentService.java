package ir.ac.sbu.evaluation.service.user;

import ir.ac.sbu.evaluation.dto.user.UserDto;
import ir.ac.sbu.evaluation.dto.user.student.StudentDto;
import ir.ac.sbu.evaluation.model.university.Faculty;
import ir.ac.sbu.evaluation.model.user.PersonalInfo;
import ir.ac.sbu.evaluation.model.user.Student;
import ir.ac.sbu.evaluation.repository.university.FacultyRepository;
import ir.ac.sbu.evaluation.repository.user.PersonalInfoRepository;
import ir.ac.sbu.evaluation.repository.user.StudentRepository;
import ir.ac.sbu.evaluation.repository.user.UserRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StudentService {

    private final PasswordEncoder passwordEncoder;

    private final UserRepository userRepository;
    private final PersonalInfoRepository personalInfoRepository;
    private final StudentRepository studentRepository;
    private final FacultyRepository facultyRepository;

    public StudentService(PasswordEncoder passwordEncoder,
            UserRepository userRepository,
            PersonalInfoRepository personalInfoRepository,
            StudentRepository studentRepository,
            FacultyRepository facultyRepository) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.personalInfoRepository = personalInfoRepository;
        this.studentRepository = studentRepository;
        this.facultyRepository = facultyRepository;
    }

    public List<UserDto> listAsUser() {
        return studentRepository.findAll().stream()
                .map(user -> UserDto.from(user, false))
                .collect(Collectors.toList());
    }

    @Transactional
    public StudentDto save(StudentDto studentDto, long facultyId) {
        if (userRepository.findByUsername(studentDto.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username exists: ID = " + studentDto.getUsername());
        }
        Faculty faculty = facultyRepository.findById(facultyId)
                .orElseThrow(() -> new IllegalArgumentException("Faculty not found: ID = " + facultyId));

        Student student = studentDto.toStudent();
        student.setPassword(passwordEncoder.encode(student.getPassword()));
        student.setFaculty(faculty);

        if (student.getPersonalInfo() != null) {
            PersonalInfo savedInfo = personalInfoRepository.save(student.getPersonalInfo());
            student.setPersonalInfo(savedInfo);
        }
        return StudentDto.from(studentRepository.save(student));
    }
}
